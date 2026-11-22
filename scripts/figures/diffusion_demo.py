"""Re-run the diffusion planner's documented Stage-2 demo and save its trajectories.

The demo (diffusion_planner/README, "Stage 2"): checkpoint stage0_v2, 4 samples,
seed 42, a synthetic obstacle at (7.5, 11.1, -4.9) with r = 0.5. The model never
saw an obstacle in training; CBF guidance is applied at sampling time only.

This mirrors sample.py's sampling path, guided and unguided from the same noise
seed, and writes the rolled-out positions plus each sample's minimum clearance
to the obstacle surface. The repo's current modules are the "X - Copy.py" files
(see DIFFUSION_REPORT.md section 2), so they are copied into a temporary shim
package first; the repository itself is not modified.

Usage, with the MPC repo's own environment:
  <mpc>/.venv-diffusion/Scripts/python.exe scripts/figures/diffusion_demo.py --mpc <mpc> --out <json>
"""
import argparse
import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--mpc", type=Path, required=True)
ap.add_argument("--out", type=Path, required=True)
args = ap.parse_args()
args.out = args.out.resolve()

src = args.mpc / "diffusion_planner"
shim = Path(tempfile.mkdtemp(prefix="diffusion_shim_"))
for name in ("dataset", "diffusion", "train", "sample"):
    shutil.copy(src / f"{name} - Copy.py", shim / f"{name}.py")
for name in ("model", "guidance", "dynamics_torch", "cond"):
    shutil.copy(src / f"{name}.py", shim / f"{name}.py")
sys.path[:0] = [str(shim), str(args.mpc / "mpc_hauv_control")]
os.chdir(src)  # the run config's dataset path is relative to diffusion_planner/

import numpy as np  # noqa: E402
import torch  # noqa: E402
from dataset import RolloutClipsDataset  # noqa: E402
from dynamics_torch import HAUVParamsTorch, rollout_controls  # noqa: E402
from guidance import Obstacle, make_guidance_fn  # noqa: E402
from mpc_hauv_control.entities import HAUV  # noqa: E402
from sample import load_run  # noqa: E402

device = "cuda" if torch.cuda.is_available() else "cpu"
_, config, tau_stats, diffusion, _ = load_run("stage0_v2", device)
T, dt, params, N, SEED = 80, 0.1, HAUVParamsTorch(), 4, 42
ds = RolloutClipsDataset(config["data"], subset_size=1, seed=0, tau_stats=tau_stats)
state0 = ds.state0(0)[None].expand(N, -1).float().to(device)
obstacle = Obstacle(pos=(7.5, 11.1, -4.9), radius=0.5)
tau_max = torch.tensor([141.4, 141.4, 200.0, 32.8])

out = {"obstacle": {"pos": list(obstacle.pos), "radius": obstacle.radius}, "dt": dt, "seed": SEED}
for name, guidance in (
    ("unguided", None),
    ("guided", make_guidance_fn(state0, tau_stats, dt, obstacle=obstacle, ego_a_max=HAUV.A_MAX,
                                goal_pos=None, cbf_weight=1.0, clf_weight=0.1, params=params)),
):
    torch.manual_seed(SEED)
    x = diffusion.sample((N, T, 4), cond=None, device=device, guidance_fn=guidance)
    tau = torch.tensor(tau_stats.denormalize(x.cpu().numpy()), dtype=torch.float32)
    states = rollout_controls(state0.cpu(), torch.clamp(tau, -tau_max, tau_max), dt, params).numpy()
    pos = states[..., :3]
    clearance = np.linalg.norm(pos - np.array(obstacle.pos), axis=-1) - obstacle.radius
    out[name] = {"xyz": pos.round(4).tolist(), "min_clearance": clearance.min(axis=1).round(3).tolist()}
    print(name, "min clearance per sample:", clearance.min(axis=1).round(3))

args.out.write_text(json.dumps(out))
shutil.rmtree(shim, ignore_errors=True)
print("wrote", args.out)
