# Figure pipeline

The selected-work figures are built from the research repositories, not drawn
by hand (the one exception, the diffusion card, is labelled as a concept
illustration). These scripts turn source frames, model predictions and logs
into web assets; the page then renders the data in the site's own style.

| Output | Built by, from | Shown in |
| --- | --- | --- |
| `public/images/work/sonar/ladder/*.webp`, `data/figures/fusionLadder.json` | `fusion_ladder.py`: one P0 **test** frame at all seven degradation levels, with the VLC fusion model's own detections (seed 0, 1.0 FPPI thresholds), computed through the sonar repo's `scripts/fig_arch_assets.py` | Sensor-fusion card, interactive viewer |
| `public/images/work/sonar/result-*.webp` | `build_figures.py`: `Sona-Camera-Fusion/paper_figures/arch_assets/`, the paper's architecture-figure frame | Sensor-fusion card, "Behind the project" |
| `data/figures/planarTrial.json` | `planar_trial.py`: a planar re-run of the HAUV waypoint experiment with the repo's own controller, vehicle and obstacle models | AUV card, animated replay |
| `data/figures/waypointStats.json` | `build_figures.py`: `mpc-cbf-autonomy/results/hauv_waypoint_*.json`, the logged single-AUV Gazebo courses | AUV card, key numbers and evidence |
| `data/figures/diffusionDemo.json` | `diffusion_demo.py`: a re-run of the diffusion planner's documented Stage-2 demo | Diffusion card, evidence text |

Nothing in either research repository is modified.

## Rebuilding

```bash
# Sensor-fusion viewer: needs the sonar repo's prediction pickles and its environment.
<sonar>/.venv/Scripts/python.exe scripts/figures/fusion_ladder.py --sonar <sonar>

# Planar replay: numpy, scipy, osqp, pyyaml (a plain venv is enough; no ROS, no Gazebo).
python scripts/figures/planar_trial.py --mpc <mpc> --seeds 30

# Diffusion demo: needs PyTorch, so it runs in the MPC repo's own environment.
<mpc>/.venv-diffusion/Scripts/python.exe scripts/figures/diffusion_demo.py \
    --mpc <mpc> --out <tmp>/diffusion_demo.json

# Everything else: any Python with Pillow, NumPy and OpenCV.
<sonar>/.venv/Scripts/python.exe scripts/figures/build_figures.py \
    --sonar <sonar> --mpc <mpc> --diffusion <tmp>/diffusion_demo.json
```

Every script prints what it wrote and the numbers it derived, so a changed
result is visible in the diff.

## Honesty rules the figures follow

- Data figures plot the data. Numbers on the page are read from these JSON
  files (see `data/projects.js`), so the copy cannot drift from the source.
- Detections are the model's, at the paper's operating point, on a test frame.
  The viewer draws only detections of the annotated objects; the evaluation's
  other boxes (counted as false positives, all kept in `fusionLadder.json`)
  are left out of the picture, and no count on the page depends on them.
- A top-down picture is only used for a planar scene. The logged Gazebo trials
  move obstacles in depth, where a top-down view shows passes above or below
  as collisions; the replay therefore comes from a re-run with the robot,
  waypoints and obstacle chords at one depth (`planar_trial.py` changes only
  the obstacle chord direction, to horizontal).
- The replay is one selected run, and says so. The selection rule is stored
  with the data, along with the batch statistics.
- Illustrations are labelled as such: the diffusion card is a concept
  animation with synthetic geometry.
