"""Build the selected-work figure assets from the two research repositories.

Nothing here is drawn by hand: every image is a frame or a model output from the
sonar-camera repository, and every number is read from a log in the MPC-CBF
repository. The page renders the JSON as SVG, so the figures stay sharp and
themeable instead of being screenshots of matplotlib plots.

Inputs (read only, never modified)
  --sonar  Sona-Camera-Fusion checkout
           paper_figures/arch_assets/                 one test frame with the fusion model's own predictions
  --mpc    mpc-cbf-autonomy checkout
           results/hauv_waypoint_*.json               logged single-AUV Gazebo waypoint courses
  --diffusion  JSON written by diffusion_demo.py (optional; skipped if absent)

Outputs
  public/images/work/sonar/result-*.webp
  data/figures/diffusionDemo.json
  data/figures/waypointStats.json

Usage (any Python with Pillow, NumPy and OpenCV):
  python scripts/figures/build_figures.py --sonar <path> --mpc <path> [--diffusion <json>]
"""
import argparse
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
IMG_OUT = ROOT / "public/images/work/sonar"
DATA_OUT = ROOT / "data/figures"


def webp(src: Path, dst: Path, quality=80, alpha=None):
    im = Image.open(src).convert("RGB")
    if alpha is not None:
        im.putalpha(Image.fromarray(alpha))
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"  {dst.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {dst.stat().st_size // 1024} KB")


def fan_alpha(src: Path):
    """Alpha mask for a sonar fan: the black region outside the fan, found by
    flood-filling near-black pixels from the image border, becomes transparent,
    so the fan sits on the page instead of in a black rectangle."""
    g = np.array(Image.open(src).convert("L"))
    dark = (g <= 6).astype(np.uint8)
    h, w = g.shape
    mask = np.zeros((h + 2, w + 2), np.uint8)
    outside = np.zeros_like(dark)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0)]:
        if dark[seed[1], seed[0]] and not outside[seed[1], seed[0]]:
            filled = dark.copy()
            cv2.floodFill(filled, mask, seed, 2)
            outside |= (filled == 2).astype(np.uint8)
    alpha = np.where(outside, 0, 255).astype(np.uint8)
    return cv2.GaussianBlur(alpha, (3, 3), 0)


def sonar_images(sonar: Path):
    IMG_OUT.mkdir(parents=True, exist_ok=True)
    arch = sonar / "paper_figures/arch_assets"
    print("model output (frame 20221212_095821_00001481, moderate darkness):")
    webp(arch / "son_out.png", IMG_OUT / "result-sonar.webp", quality=82, alpha=fan_alpha(arch / "son_in.png"))
    webp(arch / "heat_zone.png", IMG_OUT / "result-fused.webp", quality=80)


def r2(a, nd=2):
    return np.round(np.asarray(a, dtype=float), nd).tolist()


def waypoint_trials(mpc: Path):
    """Summary of the logged single-AUV Gazebo waypoint courses."""
    path = next(p for p in (mpc / "results").glob("hauv_waypoint_*.json") if "Copy" not in p.name)
    j = json.loads(path.read_text())
    trials = j["trials"]
    cfg = j["config"]
    out = {
        "source": path.name,
        "simulator": "Gazebo",
        "courses": len(trials),
        "collisions": sum(bool(t["had_true_collision"]) for t in trials),
        "marginViolations": sum(bool(t["had_margin_violation"]) for t in trials),
        "closestApproach": round(min(float(t["worst_distance"]) for t in trials), 2),
        "contactDistance": round(cfg["robot_radius"] + cfg["obs_radius"], 2),
        "obstacles": [int(t["n_obstacles"]) for t in trials],
        "obstacleAMax": cfg["obstacle_a_max"],
    }
    (DATA_OUT / "waypointStats.json").write_text(json.dumps(out))
    print(f"  data/figures/waypointStats.json  {out}")


def diffusion(src: Path):
    d = json.loads(src.read_text())
    centre, radius = np.array(d["obstacle"]["pos"]), d["obstacle"]["radius"]

    def series(kind):
        xyz = np.array(d[kind]["xyz"])
        clearance = np.linalg.norm(xyz - centre, axis=-1) - radius  # 3D, to the obstacle surface
        return {"xy": [r2(s[:, :2]) for s in xyz], "clearance": [r2(c) for c in clearance],
                "minClearance": d[kind]["min_clearance"]}

    out = {"obstacle": d["obstacle"], "dt": d["dt"], "seed": d.get("seed"),
           "guided": series("guided"), "unguided": series("unguided")}
    (DATA_OUT / "diffusionDemo.json").write_text(json.dumps(out, separators=(",", ":")))
    print(f"  data/figures/diffusionDemo.json  clearance guided={out['guided']['minClearance']}"
          f" unguided={out['unguided']['minClearance']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sonar", type=Path, required=True)
    ap.add_argument("--mpc", type=Path, required=True)
    ap.add_argument("--diffusion", type=Path, default=None)
    args = ap.parse_args()
    DATA_OUT.mkdir(parents=True, exist_ok=True)
    sonar_images(args.sonar)
    print("single-AUV Gazebo waypoint courses:")
    waypoint_trials(args.mpc)
    if args.diffusion and args.diffusion.exists():
        print("diffusion demo:")
        diffusion(args.diffusion)


if __name__ == "__main__":
    main()
