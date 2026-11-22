"""A planar re-run of the HAUV waypoint experiment, for the top-down replay.

The logged Gazebo trials are 3D: obstacles bounce along chords with a depth
component, so drawn from above they appear to pass through the vehicle when
they actually pass above or below it. A top-down replay is only honest if the
scene is planar, so this script re-runs the same controller in a scene that is:

  - the repository's own MPCCBFController, HAUV (Fossen 4-DOF) model, obstacle
    model (Asteroid, bang-bang bounce), waypoint task and heading logic, with the
    configuration of the logged Gazebo run (results/hauv_waypoint_*.json);
  - the start, every waypoint and every obstacle chord at one depth (-4 m), so
    all motion that matters is in the plane the page draws;
  - pure simulation (the HAUV integrates its own dynamics), not Gazebo.

It runs a batch of seeds, writes the batch statistics, and keeps one run for
the replay (the selection rule is printed and stored with the data).

Needs numpy, scipy, osqp and pyyaml (the MPC repo's ROS environment, or any venv):
  python scripts/figures/planar_trial.py --mpc <mpc-cbf-autonomy> [--seeds 24]
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
DEPTH = -4.0
MAX_TICKS = 3000  # 300 s at dt = 0.1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--mpc", type=Path, required=True)
    ap.add_argument("--seeds", type=int, default=24)
    args = ap.parse_args()
    sys.path.insert(0, str(args.mpc / "mpc_hauv_control"))

    import mpc_hauv_control.tasks.utils as tu  # noqa: E402
    from mpc_hauv_control.mpc_cbf.heading_hybrid import HybridHeadingCommit  # noqa: E402
    from mpc_hauv_control.mpc_cbf.solver import MPCCBFController  # noqa: E402
    from mpc_hauv_control.tasks import HAUVWaypointTask  # noqa: E402

    # The one change: obstacle chords and jitter perpendicular to the leg *in the
    # horizontal plane* (the repo picks any 3D direction orthogonal to the leg).
    def planar_transverse(tangent, rng=None):
        rng = tu._default_rng(rng)
        t = np.array([tangent[0], tangent[1], 0.0])
        d = np.array([-t[1], t[0], 0.0]) / (np.linalg.norm(t) + 1e-12)
        return d * rng.choice([-1.0, 1.0])
    tu._transverse_direction = planar_transverse

    logged = next(p for p in (args.mpc / "results").glob("hauv_waypoint_*.json") if "Copy" not in p.name)
    cfg = json.loads(logged.read_text())["config"]
    dt = 0.1
    rr, orad = cfg["robot_radius"], cfg["obs_radius"]
    D_s = rr + orad

    def run(seed):
        rng = np.random.default_rng(seed)
        # The repo's random walk (it needs a depth range to sample in), then flattened
        # onto the working depth; legs keep their horizontal geometry.
        wps = tu.generate_random_waypoints(
            rng, np.array([0.0, 0.0, DEPTH]), cfg["num_waypoints"], leg_min=cfg["leg_min_dist"],
            leg_max=cfg["leg_max_dist"], leg_clearance=cfg["leg_clearance"], z_bounds=tuple(cfg["z_bounds"]),
            xy_bound=cfg["xy_bound"], first_leg_max=cfg["first_leg_max_dist"])
        wps = [np.array([w[0], w[1], DEPTH]) for w in wps]
        task = HAUVWaypointTask(
            waypoints=wps, rng=rng, start_pose=(0.0, 0.0, DEPTH), obstacle_mode=cfg["obstacle_mode"],
            obstacle_spacing=cfg["obstacle_spacing"], obs_min_separation=cfg["obs_min_separation"],
            waypoint_clearance=cfg["waypoint_clearance"], obstacle_a_max=cfg["obstacle_a_max"],
            threshold=cfg["waypoint_threshold"],
            mpc_overrides={k: cfg[k] for k in ("horizon", "r_weight", "Q_heading", "qp_max_iter",
                                               "gamma_mode", "gamma_delta", "gamma_fixed")},
        )
        task.build_scene(dt)
        robot, obstacles = task.robot, task.obstacles
        mpc = MPCCBFController(entity=robot, dt=dt, **task.mpc_config())
        step_cost, heading = task.make_step_cost(), HybridHeadingCommit()
        R, O, H, A = [], [], [], []
        t = 0.0
        for _ in range(MAX_TICKS):
            state = np.concatenate([robot.position, robot.velocity])
            pos = robot.get_current_position()
            obs = [{"pos": o.get_current_position(), "vel": o.get_current_velocity(),
                    "radius": orad, "a_max": o.A_MAX} for o in obstacles]
            target = task.next_target(pos, t)
            if target is None:
                break
            target = target.copy()
            target[3] = heading.effective_ref(state[3], target[3])
            try:
                u = mpc.compute_control(state, target, step_cost)
                u, mode = mpc.apply_cbf_filter(state, u, obs, rr)
            except Exception:  # same policy as the node: command zero for the tick
                u, mode = np.zeros(mpc.control_dim), "SOLVER_FAULT"
            R.append(pos)
            O.append([o["pos"] for o in obs])
            H.append(min(mpc.cbf_margins(state, obs, rr)) if obs else np.inf)
            A.append(mode != "nominal")
            robot.update_step(u)
            for o in obstacles:
                o.update_step()
            t += dt
        R, O = np.array(R), np.array(O)
        d = np.linalg.norm(O - R[:, None, :], axis=-1)
        return dict(seed=seed, R=R, O=O, H=np.array(H), A=np.array(A), d=d, done=target is None,
                    wps=task.reference_path(), closest=float(d.min()), collision=bool((d < D_s).any()),
                    active=float(np.mean(A)), dz=float(np.abs(np.concatenate([R[:, 2], O[..., 2].ravel()]) - DEPTH).max()))

    runs = []
    for s in range(args.seeds):
        r = run(s)
        runs.append(r)
        print(f"  seed {s:2d}: {len(r['R'])} ticks, finished={r['done']}, closest {r['closest']:.2f} m, "
              f"collision={r['collision']}, filter active {r['active']:.0%}, max |dz| {r['dz']:.2f} m")

    # Replay choice: finished, no collision, and the filter visibly at work
    # (most time active among those whose closest approach still exceeds D_s).
    ok = [r for r in runs if r["done"] and not r["collision"]]
    pick = max(ok, key=lambda r: r["active"])
    stride = 2

    def r2(a):
        return np.round(np.asarray(a, dtype=float), 2).tolist()

    out = {
        "source": f"planar re-run of {logged.name} configuration",
        "simulator": "python (Fossen 4-DOF), planar scene",
        "seed": pick["seed"], "selection": "finished, collision-free, highest filter-active fraction",
        "dt": dt * stride, "depth": DEPTH, "maxDepthDeviation": round(pick["dz"], 3),
        "safetyDistance": round(D_s, 2), "robotRadius": rr, "obstacleRadius": orad,
        "obstacleAMax": cfg["obstacle_a_max"],
        "batch": {"runs": len(runs), "finished": sum(r["done"] for r in runs),
                  "collisions": sum(r["collision"] for r in runs),
                  "closestApproach": round(min(r["closest"] for r in runs), 2)},
        "summary": {"closestApproach": round(pick["closest"], 2), "minMargin": round(float(pick["H"].min()), 2),
                    "qpActive": round(pick["active"], 2), "seconds": round(len(pick["R"]) * dt, 1)},
        "waypoints": r2(pick["wps"][:, :2]),
        "robot": r2(pick["R"][::stride, :2]),
        "obstacles": [r2(pick["O"][::stride, i, :2]) for i in range(pick["O"].shape[1])],
        "nearest": r2(pick["d"].min(axis=1)[::stride]),
        "qpActive": pick["A"][::stride].astype(int).tolist(),
        "minH": r2(pick["H"][::stride]),
    }
    dst = ROOT / "data/figures/planarTrial.json"
    dst.write_text(json.dumps(out, separators=(",", ":")))
    print(f"  picked seed {pick['seed']}; batch {out['batch']}; wrote {dst.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
