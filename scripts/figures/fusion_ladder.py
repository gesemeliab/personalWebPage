"""Per-level detections for the sensor-fusion viewer.

One P0 *test* frame at every degradation level, with the VLC fusion model's own
predictions (seed 0, the 1.0 FPPI validation thresholds), computed through the
sonar repository's figure code (scripts/fig_arch_assets.py) so the boxes are
exactly what the paper's evaluation counts.

Per level it writes
  public/images/work/sonar/ladder/<level>.webp       the camera input at that level
  public/images/work/sonar/ladder/<level>-zone.webp  where the sonar-only detections place the
                                                     object in the camera image (RGBA heat, empty if none)
  public/images/work/sonar/ladder/sonar.webp         the sonar fan (one image: sonar is unaffected)
and data/figures/fusionLadder.json with every box in percent of the image, so the
page draws them as crisp SVG.

Frame choice: searched the test frames for one where, in both darkness and
turbidity, the camera head finds objects at the light levels and a sonar-only
detection carries the frame at the heavy level, with few false positives.

Runs in the sonar repo's environment (needs its prediction pickles):
  <sonar>/.venv/Scripts/python.exe scripts/figures/fusion_ladder.py --sonar <sonar>
"""
import argparse
import json
import os
import sys
from pathlib import Path

import cv2
import numpy as np
from matplotlib import cm
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
IMG = ROOT / "public/images/work/sonar/ladder"
STEM, SEED, WIDTH = "20221212_095821_00010381", 0, 968
LEVELS = ["clean", "dark_1", "dark_2", "dark_3", "ifm_1C", "ifm_3C", "ifm_5C"]


def r1(a):
    return np.round(np.asarray(a, dtype=float), 1).tolist()


def save(arr_rgb_or_rgba, dst, quality):
    im = Image.fromarray(arr_rgb_or_rgba)
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"  {dst.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {dst.stat().st_size // 1024} KB")


def zone_rgba(D, shape, alpha=0.8, lo=0.3, gamma=0.5):
    """The same heat rendering as the paper (fig_arch_assets.heat) but as a
    transparent overlay, so the page can fade it in over the camera frame."""
    h, w = shape
    out = np.zeros((h, w, 4), np.uint8)
    if not D.sum():
        return out
    hm = cv2.resize((D / D.max()).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC).clip(0, 1) ** gamma
    out[..., :3] = (cm.inferno(lo + (1 - lo) * hm)[..., :3] * 255).astype(np.uint8)
    out[..., 3] = (alpha * hm * 255).astype(np.uint8)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sonar", type=Path, required=True)
    sonar = ap.parse_args().sonar.resolve()
    sys.path.insert(0, str(sonar / "scripts"))
    os.chdir(sonar)
    import fig_arch_assets as A  # noqa: E402  (the sonar repo's own figure code)
    from m4a_v2 import evaluate, prep  # noqa: E402
    from sonar_zones import SON_CLASSES  # noqa: E402

    P, objs, thr, Z = A.load()
    o, t = objs[STEM], thr[SEED]
    IMG.mkdir(parents=True, exist_ok=True)
    out = {"frame": STEM, "seed": SEED, "split": "test", "thresholdFppi": 1.0, "linkedObjects": len(o["links"]),
           "groundTruth": [r1((g[1], g[2], g[1] + g[3], g[2] + g[4])) for g in o["camera"]], "levels": {}}

    son = cv2.imread(str(A.R / f"datasets/sonar_v2b/images/test/{o['session']}_{Path(o['sonar_frame']).stem}_v2.png"))
    for lv in LEVELS:
        F = prep(P, A.SD, SEED, "test", lv, STEM, o)
        r = evaluate(F, *t)
        cam_boxes = F["cb"][r["keep"]]
        assoc, alone = F["sp"][(F["sc"] >= t[1]) & r["absorbed"]], F["sp"][r["out"]]
        raw_b, _, raw_l = P["son_m5"][A.SD["son_m5"], SEED, "test", lv, STEM]
        alone_cls = [SON_CLASSES[int(raw_l[np.abs(np.asarray(raw_b) - b).sum(1).argmin()])] for b in alone]
        folder = "test" if lv == "clean" else f"test_{lv}"
        cam = cv2.imread(str(A.R / f"datasets/cam_v2/images/{folder}/{STEM}.png"))
        fan = Z.fan_of("test", o)
        D = np.zeros((100, 100))
        for b, c in zip(alone, alone_cls):
            brg, rng = Z.polar((b[0], b[1], b[2] - b[0], b[3] - b[1]), fan)
            D += Z.density("class+range", brg, rng, c)
        save(cv2.cvtColor(cam, cv2.COLOR_BGR2RGB), IMG / f"{lv}.webp", 78)
        save(zone_rgba(D, cam.shape[:2]), IMG / f"{lv}-zone.webp", 82)
        out["levels"][lv] = {
            "camera": [r1(b) for b in cam_boxes],
            "cameraIsFp": [not bool(x) for x in F["tp"][r["keep"]]],
            "sonarLinked": [r1(b) for b in assoc],
            "sonarOnly": [r1(b) for b in alone],
            # peak of the zone in camera-image percent (D is a 100x100 grid over the image), for its label
            "zonePeak": [float(i) + .5 for i in np.unravel_index(D.argmax(), D.shape)[::-1]] if D.sum() else None,
            "foundByCamera": int(sum(r["lc"])), "foundBySonarOnly": int(sum(r["ls"])), "falsePositives": int(r["fp"]),
        }
        print(f"  {lv}: {out['levels'][lv]['foundByCamera']} camera, "
              f"{out['levels'][lv]['foundBySonarOnly']} sonar-only, {r['fp']} FP")
    h, w = son.shape[:2]
    out["cameraSize"], out["sonarSize"] = [int(cam.shape[1]), int(cam.shape[0])], [int(w), int(h)]

    # sonar fan with the black surround transparent (same rule as build_figures.fan_alpha)
    sys.path.insert(0, str(ROOT / "scripts/figures"))
    from build_figures import fan_alpha  # noqa: E402
    src = A.R / f"datasets/sonar_v2b/images/test/{o['session']}_{Path(o['sonar_frame']).stem}_v2.png"
    rgba = np.dstack([cv2.cvtColor(son, cv2.COLOR_BGR2RGB), fan_alpha(src)])
    Image.fromarray(rgba).save(IMG / "sonar.webp", "WEBP", quality=82, method=6)
    print(f"  {(IMG / 'sonar.webp').relative_to(ROOT)}  {w}x{h}")

    dst = ROOT / "data/figures/fusionLadder.json"
    dst.write_text(json.dumps(out, separators=(",", ":")))
    print(f"  {dst.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
