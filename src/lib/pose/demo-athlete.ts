import type { Landmark } from "./types";

const CYCLE = 4.2;

type Joints = {
  nose: [number, number];
  shL: [number, number];
  shR: [number, number];
  elL: [number, number];
  elR: [number, number];
  wrL: [number, number];
  wrR: [number, number];
  hipL: [number, number];
  hipR: [number, number];
  kL: [number, number];
  kR: [number, number];
  aL: [number, number];
  aR: [number, number];
  heelL: [number, number];
  heelR: [number, number];
  fL: [number, number];
  fR: [number, number];
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function ease(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function mix(a: Joints, b: Joints, t: number): Joints {
  const k = clamp(t, 0, 1);
  const out = { ...a };
  (Object.keys(a) as Array<keyof Joints>).forEach((key) => {
    out[key] = [lerp(a[key][0], b[key][0], k), lerp(a[key][1], b[key][1], k)];
  });
  return out;
}

function shift(j: Joints, dx: number, dy = 0): Joints {
  const out = { ...j };
  (Object.keys(j) as Array<keyof Joints>).forEach((key) => {
    out[key] = [j[key][0] + dx, j[key][1] + dy];
  });
  return out;
}

/** Classic crouch SET, side view, facing right, large in frame. */
const SET: Joints = {
  nose: [0.5, 0.4],
  shL: [0.46, 0.5],
  shR: [0.5, 0.48],
  elL: [0.5, 0.68],
  elR: [0.54, 0.66],
  wrL: [0.5, 0.86],
  wrR: [0.55, 0.86],
  hipL: [0.34, 0.36],
  hipR: [0.38, 0.34],
  kL: [0.22, 0.58],
  kR: [0.52, 0.6],
  aL: [0.16, 0.86],
  aR: [0.44, 0.86],
  heelL: [0.13, 0.86],
  heelR: [0.4, 0.86],
  fL: [0.2, 0.88],
  fR: [0.5, 0.88],
};

const CLEAR: Joints = {
  nose: [0.54, 0.3],
  shL: [0.5, 0.4],
  shR: [0.54, 0.38],
  elL: [0.62, 0.5],
  elR: [0.42, 0.34],
  wrL: [0.7, 0.58],
  wrR: [0.34, 0.28],
  hipL: [0.4, 0.46],
  hipR: [0.44, 0.44],
  kL: [0.3, 0.64],
  kR: [0.58, 0.5],
  aL: [0.22, 0.86],
  aR: [0.52, 0.7],
  heelL: [0.19, 0.86],
  heelR: [0.48, 0.72],
  fL: [0.28, 0.88],
  fR: [0.58, 0.72],
};

const STEP1: Joints = {
  nose: [0.6, 0.26],
  shL: [0.54, 0.36],
  shR: [0.58, 0.34],
  elL: [0.46, 0.28],
  elR: [0.7, 0.46],
  wrL: [0.4, 0.2],
  wrR: [0.78, 0.56],
  hipL: [0.48, 0.48],
  hipR: [0.52, 0.46],
  kL: [0.58, 0.64],
  kR: [0.4, 0.58],
  aL: [0.62, 0.86],
  aR: [0.32, 0.72],
  heelL: [0.58, 0.86],
  heelR: [0.28, 0.74],
  fL: [0.68, 0.88],
  fR: [0.38, 0.74],
};

const RUN_A: Joints = {
  nose: [0.7, 0.2],
  shL: [0.64, 0.3],
  shR: [0.68, 0.28],
  elL: [0.54, 0.24],
  elR: [0.8, 0.4],
  wrL: [0.48, 0.16],
  wrR: [0.88, 0.5],
  hipL: [0.6, 0.46],
  hipR: [0.64, 0.44],
  kL: [0.72, 0.6],
  kR: [0.5, 0.58],
  aL: [0.7, 0.82],
  aR: [0.42, 0.74],
  heelL: [0.66, 0.82],
  heelR: [0.38, 0.76],
  fL: [0.76, 0.84],
  fR: [0.48, 0.76],
};

const RUN_B: Joints = {
  nose: [0.78, 0.18],
  shL: [0.72, 0.28],
  shR: [0.76, 0.26],
  elL: [0.86, 0.38],
  elR: [0.62, 0.22],
  wrL: [0.94, 0.48],
  wrR: [0.56, 0.14],
  hipL: [0.7, 0.46],
  hipR: [0.74, 0.44],
  kL: [0.6, 0.58],
  kR: [0.84, 0.58],
  aL: [0.5, 0.76],
  aR: [0.82, 0.8],
  heelL: [0.46, 0.78],
  heelR: [0.78, 0.8],
  fL: [0.56, 0.78],
  fR: [0.9, 0.82],
};

function poseAt(t: number): Joints {
  if (t < 0.7) return SET;
  if (t < 0.92) return mix(SET, CLEAR, ease((t - 0.7) / 0.22));
  if (t < 1.28) return mix(CLEAR, STEP1, ease((t - 0.92) / 0.36));
  if (t < 1.7) return mix(STEP1, RUN_A, ease((t - 1.28) / 0.42));
  const u = t - 1.7;
  const stride = 0.42;
  const cycle = (u / stride) % 2;
  const run =
    cycle < 1 ? mix(RUN_A, RUN_B, ease(cycle)) : mix(RUN_B, RUN_A, ease(cycle - 1));
  const travel = Math.min(0.12, u * 0.04);
  const moving = shift(run, travel);
  if (t > 3.85) return mix(moving, SET, ease((t - 3.85) / 0.35));
  return moving;
}

function lm(x: number, y: number, z = 0): Landmark {
  return { x, y, z, visibility: 1 };
}

export function sampleSprintPose(timeSec: number): Landmark[] {
  const t = ((timeSec % CYCLE) + CYCLE) % CYCLE;
  const p = poseAt(t);
  const pts: Landmark[] = Array.from({ length: 33 }, () => lm(p.nose[0], p.nose[1]));
  pts[0] = lm(p.nose[0], p.nose[1]);
  pts[1] = lm(p.nose[0] - 0.012, p.nose[1] - 0.01, 0.02);
  pts[2] = lm(p.nose[0] - 0.02, p.nose[1] - 0.008, 0.03);
  pts[3] = lm(p.nose[0] - 0.028, p.nose[1] - 0.004, 0.03);
  pts[4] = lm(p.nose[0] + 0.01, p.nose[1] - 0.01, -0.02);
  pts[5] = lm(p.nose[0] + 0.018, p.nose[1] - 0.008, -0.03);
  pts[6] = lm(p.nose[0] + 0.024, p.nose[1] - 0.004, -0.03);
  pts[7] = lm(p.nose[0] - 0.03, p.nose[1] + 0.004, 0.05);
  pts[8] = lm(p.nose[0] + 0.028, p.nose[1] + 0.004, -0.05);
  pts[9] = lm(p.nose[0] - 0.008, p.nose[1] + 0.018);
  pts[10] = lm(p.nose[0] + 0.01, p.nose[1] + 0.018);
  pts[11] = lm(p.shL[0], p.shL[1], 0.05);
  pts[12] = lm(p.shR[0], p.shR[1], -0.05);
  pts[13] = lm(p.elL[0], p.elL[1], 0.06);
  pts[14] = lm(p.elR[0], p.elR[1], -0.06);
  pts[15] = lm(p.wrL[0], p.wrL[1], 0.06);
  pts[16] = lm(p.wrR[0], p.wrR[1], -0.06);
  pts[17] = lm(p.wrL[0] + 0.01, p.wrL[1] + 0.01, 0.06);
  pts[18] = lm(p.wrR[0] + 0.01, p.wrR[1] + 0.01, -0.06);
  pts[19] = lm(p.wrL[0] + 0.014, p.wrL[1], 0.06);
  pts[20] = lm(p.wrR[0] + 0.014, p.wrR[1], -0.06);
  pts[21] = lm(p.wrL[0], p.wrL[1] - 0.008, 0.06);
  pts[22] = lm(p.wrR[0], p.wrR[1] - 0.008, -0.06);
  pts[23] = lm(p.hipL[0], p.hipL[1], 0.04);
  pts[24] = lm(p.hipR[0], p.hipR[1], -0.04);
  pts[25] = lm(p.kL[0], p.kL[1], 0.04);
  pts[26] = lm(p.kR[0], p.kR[1], -0.04);
  pts[27] = lm(p.aL[0], p.aL[1], 0.04);
  pts[28] = lm(p.aR[0], p.aR[1], -0.04);
  pts[29] = lm(p.heelL[0], p.heelL[1], 0.04);
  pts[30] = lm(p.heelR[0], p.heelR[1], -0.04);
  pts[31] = lm(p.fL[0], p.fL[1], 0.04);
  pts[32] = lm(p.fR[0], p.fR[1], -0.04);
  return pts;
}

export const DEMO_CYCLE = CYCLE;
