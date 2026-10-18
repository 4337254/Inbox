import { JOINT_INDEX, type BiomechSample, type Landmark } from "./types";

const MASS = 78;
const G = 9.81;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function vis(lm: Landmark | undefined, min = 0.25) {
  return !!lm && (lm.visibility === undefined || lm.visibility >= min);
}

function mid(a: Landmark, b: Landmark): Landmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
    z: (a.z + b.z) / 2,
    visibility: Math.min(a.visibility, b.visibility),
  };
}

export function angleAt(
  a: Landmark | undefined,
  b: Landmark | undefined,
  c: Landmark | undefined,
): number | null {
  if (!vis(a) || !vis(b) || !vis(c) || !a || !b || !c) return null;
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const mag = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
  if (mag < 1e-6) return null;
  const dot = clamp((abx * cbx + aby * cby) / mag, -1, 1);
  return (Math.acos(dot) * 180) / Math.PI;
}

/** Torso lean from vertical, degrees. 0 = upright, ~90 = parallel to track. */
export function torsoLean(
  shoulder: Landmark | undefined,
  hip: Landmark | undefined,
): number | null {
  if (!vis(shoulder) || !vis(hip) || !shoulder || !hip) return null;
  const dx = shoulder.x - hip.x;
  const dy = shoulder.y - hip.y;
  const fromUp = Math.atan2(dx, -dy);
  return clamp((Math.abs(fromUp) * 180) / Math.PI, 0, 180);
}

export function lerpLandmarks(
  a: Landmark[] | null,
  b: Landmark[] | null,
  t: number,
): Landmark[] | null {
  if (!b) return a;
  if (!a || a.length !== b.length) return b;
  const k = clamp(t, 0, 1);
  return a.map((p, i) => {
    const q = b[i];
    return {
      x: p.x + (q.x - p.x) * k,
      y: p.y + (q.y - p.y) * k,
      z: p.z + (q.z - p.z) * k,
      visibility: q.visibility,
    };
  });
}

export function smoothToward(
  prev: Landmark[] | null,
  next: Landmark[],
  alpha: number,
): Landmark[] {
  if (!prev || prev.length !== next.length) return next;
  return next.map((q, i) => {
    const p = prev[i];
    return {
      x: p.x + (q.x - p.x) * alpha,
      y: p.y + (q.y - p.y) * alpha,
      z: p.z + (q.z - p.z) * alpha,
      visibility: q.visibility,
    };
  });
}

/** One-Euro: damp jitter when still, snap on sprint motion. No prediction / no coast. */
function smoothingFactor(dt: number, cutoff: number) {
  const r = 2 * Math.PI * cutoff * dt;
  return r / (r + 1);
}

class OneEuroAxis {
  private x = 0;
  private dx = 0;
  private t = 0;
  private ready = false;

  reset() {
    this.ready = false;
    this.dx = 0;
  }

  snap(v: number, t: number) {
    this.ready = true;
    this.x = v;
    this.dx = 0;
    this.t = t;
    return v;
  }

  next(v: number, t: number, minCutoff: number, beta: number) {
    if (!this.ready) {
      this.ready = true;
      this.x = v;
      this.dx = 0;
      this.t = t;
      return v;
    }
    const dt = Math.max(0.006, Math.min(0.05, (t - this.t) / 1000));
    this.t = t;
    const edx = (v - this.x) / dt;
    const ad = smoothingFactor(dt, 1);
    this.dx += ad * (edx - this.dx);
    const cutoff = minCutoff + beta * Math.abs(this.dx);
    const a = smoothingFactor(dt, cutoff);
    this.x += a * (v - this.x);
    return this.x;
  }
}

export class LandmarkFilter {
  private axes: OneEuroAxis[] | null = null;
  private last: Landmark[] | null = null;

  reset() {
    this.axes = null;
    this.last = null;
  }

  next(raw: Landmark[], t: number): Landmark[] {
    if (!this.axes || this.axes.length !== raw.length * 2) {
      this.axes = Array.from({ length: raw.length * 2 }, () => new OneEuroAxis());
    }
    const out = raw.map((q, i) => {
      const held = this.last?.[i];
      if ((q.visibility ?? 1) < 0.22 && held) {
        return { ...held, visibility: q.visibility };
      }
      const jump = held != null && Math.hypot(q.x - held.x, q.y - held.y) > 0.018;
      return {
        x: jump ? this.axes![i * 2].snap(q.x, t) : this.axes![i * 2].next(q.x, t, 3.2, 0.08),
        y: jump ? this.axes![i * 2 + 1].snap(q.y, t) : this.axes![i * 2 + 1].next(q.y, t, 3.2, 0.08),
        z: q.z,
        visibility: q.visibility,
      };
    });
    this.last = out;
    return out;
  }
}

/** True only for a real body (shoulders + hips + at least one leg). Rejects faces, blobs, noise. */
export function isHumanPose(landmarks: Landmark[]): boolean {
  if (!landmarks || landmarks.length < 27) return false;
  const shL = landmarks[JOINT_INDEX.leftShoulder];
  const shR = landmarks[JOINT_INDEX.rightShoulder];
  const hipL = landmarks[JOINT_INDEX.leftHip];
  const hipR = landmarks[JOINT_INDEX.rightHip];
  if (!vis(shL, 0.28) || !vis(shR, 0.28) || !vis(hipL, 0.24) || !vis(hipR, 0.24)) return false;
  const shoulderW = Math.hypot(shL.x - shR.x, shL.y - shR.y);
  const hipW = Math.hypot(hipL.x - hipR.x, hipL.y - hipR.y);
  const midSh = mid(shL, shR);
  const midHip = mid(hipL, hipR);
  const torsoLen = Math.hypot(midSh.x - midHip.x, midSh.y - midHip.y);
  if (shoulderW < 0.02 || hipW < 0.015 || torsoLen < 0.035 || torsoLen > 0.85) return false;
  if (shoulderW > torsoLen * 3.4) return false;
  const kL = landmarks[JOINT_INDEX.leftKnee];
  const kR = landmarks[JOINT_INDEX.rightKnee];
  const aL = landmarks[JOINT_INDEX.leftAnkle];
  const aR = landmarks[JOINT_INDEX.rightAnkle];
  const legs =
    Number(vis(kL, 0.2)) + Number(vis(kR, 0.2)) + Number(vis(aL, 0.18)) + Number(vis(aR, 0.18));
  if (legs < 1) return false;
  return poseConfidence(landmarks) >= 0.26;
}

/** Stay locked on a body even if one joint dips for a few frames. */
export function isTrackedHuman(landmarks: Landmark[], locked: boolean): boolean {
  if (isHumanPose(landmarks)) return true;
  if (!locked) return false;
  return poseConfidence(landmarks) >= 0.2;
}

export class GaitTracker {
  contacting = false;
  private contactStart = 0;
  private flightStart = 0;
  private lastStepT = 0;
  private lastHipX = 0;
  private prevHipX = 0;
  private prevT = 0;
  private groundY = 0.82;
  contactMs: number | null = null;
  flightMs: number | null = null;
  strideM: number | null = null;
  cadenceSpm: number | null = null;
  speedMs: number | null = null;

  reset() {
    this.contacting = false;
    this.contactStart = 0;
    this.flightStart = 0;
    this.lastStepT = 0;
    this.lastHipX = 0;
    this.prevHipX = 0;
    this.prevT = 0;
    this.groundY = 0.82;
    this.contactMs = null;
    this.flightMs = null;
    this.strideM = null;
    this.cadenceSpm = null;
    this.speedMs = null;
  }

  update(landmarks: Landmark[], t: number) {
    const hipL = landmarks[JOINT_INDEX.leftHip];
    const hipR = landmarks[JOINT_INDEX.rightHip];
    const shL = landmarks[JOINT_INDEX.leftShoulder];
    const shR = landmarks[JOINT_INDEX.rightShoulder];
    const aL = landmarks[JOINT_INDEX.leftAnkle];
    const aR = landmarks[JOINT_INDEX.rightAnkle];
    if (!hipL || !hipR || !aL || !aR) return;
    const hip = mid(hipL, hipR);
    const torsoLen =
      vis(shL) && vis(shR) && shL && shR
        ? Math.hypot(mid(shL, shR).x - hip.x, mid(shL, shR).y - hip.y)
        : 0.18;
    const meters = torsoLen > 0.03 ? 0.48 / torsoLen : 1.6;
    const footY = Math.max(
      vis(aL, 0.2) ? aL.y : 0,
      vis(aR, 0.2) ? aR.y : 0,
    );
    if (footY > 0.35) this.groundY = this.groundY * 0.9 + footY * 0.1;
    const nowContact = footY >= this.groundY - 0.02 && footY > hip.y + 0.04;

    if (this.prevT > 0) {
      const dt = (t - this.prevT) / 1000;
      if (dt > 0.005 && dt < 0.25) {
        const v = (Math.abs(hip.x - this.prevHipX) / dt) * meters;
        this.speedMs = this.speedMs == null ? v : this.speedMs * 0.65 + v * 0.35;
      }
    }

    if (nowContact && !this.contacting) {
      if (this.flightStart > 0) this.flightMs = t - this.flightStart;
      if (this.lastStepT > 0) {
        const step = (t - this.lastStepT) / 1000;
        if (step > 0.12 && step < 0.7) {
          this.cadenceSpm = 60 / step;
          this.strideM = Math.abs(hip.x - this.lastHipX) * meters;
        }
      }
      this.contactStart = t;
      this.lastStepT = t;
      this.lastHipX = hip.x;
    }
    if (!nowContact && this.contacting && this.contactStart > 0) {
      this.contactMs = t - this.contactStart;
      this.flightStart = t;
    }
    this.contacting = nowContact;
    this.prevHipX = hip.x;
    this.prevT = t;
  }
}

export function poseConfidence(landmarks: Landmark[]): number {
  if (!landmarks.length) return 0;
  const core = [
    JOINT_INDEX.leftShoulder,
    JOINT_INDEX.rightShoulder,
    JOINT_INDEX.leftHip,
    JOINT_INDEX.rightHip,
    JOINT_INDEX.leftKnee,
    JOINT_INDEX.rightKnee,
  ];
  let s = 0;
  for (const i of core) s += landmarks[i]?.visibility ?? 0;
  return s / core.length;
}

export function landmarkBBox(landmarks: Landmark[]) {
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  let n = 0;
  for (const lm of landmarks) {
    if ((lm.visibility ?? 1) < 0.2) continue;
    n += 1;
    minX = Math.min(minX, lm.x);
    minY = Math.min(minY, lm.y);
    maxX = Math.max(maxX, lm.x);
    maxY = Math.max(maxY, lm.y);
  }
  if (!n) return { x: 0, y: 0, w: 1, h: 1 };
  return { x: minX, y: minY, w: Math.max(0.04, maxX - minX), h: Math.max(0.04, maxY - minY) };
}

function phaseFrom(torso: number | null, knee: number | null): BiomechSample["phase"] {
  if (torso == null) return "unknown";
  if (torso > 95 && knee != null && knee < 140) return "set";
  if (torso > 55) return "drive";
  if (torso > 28) return "accel";
  return "upright";
}

export function analyzePose(
  landmarks: Landmark[],
  prev: { landmarks: Landmark[]; t: number } | null,
  t: number,
  gait?: GaitTracker | null,
): BiomechSample {
  const L = landmarks;
  const hipL = L[JOINT_INDEX.leftHip];
  const hipR = L[JOINT_INDEX.rightHip];
  const shL = L[JOINT_INDEX.leftShoulder];
  const shR = L[JOINT_INDEX.rightShoulder];
  const kneeL = angleAt(hipL, L[JOINT_INDEX.leftKnee], L[JOINT_INDEX.leftAnkle]);
  const kneeR = angleAt(hipR, L[JOINT_INDEX.rightKnee], L[JOINT_INDEX.rightAnkle]);
  const knee =
    kneeL != null && kneeR != null
      ? Math.min(kneeL, kneeR)
      : (kneeL ?? kneeR);

  const shoulder = vis(shL) && vis(shR) && shL && shR ? mid(shL, shR) : shL ?? shR;
  const hip = vis(hipL) && vis(hipR) && hipL && hipR ? mid(hipL, hipR) : hipL ?? hipR;
  const torso = torsoLean(shoulder, hip);
  const hipAngle = angleAt(shL ?? shR, hip, L[JOINT_INDEX.leftKnee] ?? L[JOINT_INDEX.rightKnee]);
  const ankle = angleAt(
    L[JOINT_INDEX.leftKnee],
    L[JOINT_INDEX.leftAnkle],
    L[JOINT_INDEX.leftFoot],
  );
  const shoulderHip =
    vis(shL) && vis(hipL) && shL && hipL
      ? (Math.atan2(hipL.y - shL.y, hipL.x - shL.x) * 180) / Math.PI
      : null;

  let comAccel = 0;
  let comSpeed = 0;
  if (hip && prev?.landmarks.length) {
    const pHipL = prev.landmarks[JOINT_INDEX.leftHip];
    const pHipR = prev.landmarks[JOINT_INDEX.rightHip];
    const pHip =
      vis(pHipL) && vis(pHipR) && pHipL && pHipR ? mid(pHipL, pHipR) : pHipL ?? pHipR;
    const dt = Math.max(0.008, (t - prev.t) / 1000);
    if (pHip) {
      const vx = (hip.x - pHip.x) / dt;
      const vy = (hip.y - pHip.y) / dt;
      comSpeed = Math.hypot(vx, vy);
      comAccel = comSpeed / Math.max(dt, 0.016);
    }
  }

  const conf = poseConfidence(landmarks);
  const kneeTarget = 132;
  const torsoTarget = 48;
  const kneeScore = knee != null ? clamp(1 - Math.abs(knee - kneeTarget) / 50, 0, 1) : 0;
  const torsoScore = torso != null ? clamp(1 - Math.abs(torso - torsoTarget) / 55, 0, 1) : 0;
  const explode = clamp(comSpeed * 0.35, 0, 1);
  const power = clamp(kneeScore * 42 + torsoScore * 33 + explode * 25, 0, 100);

  const flex = knee != null ? ((180 - knee) * Math.PI) / 180 : 0.6;
  const torqueKnee = MASS * 0.22 * G * Math.sin(flex) * 0.42;
  const torqueHip = MASS * 0.28 * G * Math.sin(((torso ?? 40) * Math.PI) / 180) * 0.38;
  const torqueAnkle = MASS * 0.12 * G * Math.sin(flex * 0.7) * 0.28;
  const grf = MASS * (G + clamp(comAccel * 0.08, 0, 18));
  if (gait) gait.update(landmarks, t);

  return {
    t,
    kneeL,
    kneeR,
    knee,
    torso,
    hip: hipAngle,
    ankle,
    shoulderHip,
    power,
    grf,
    comAccel: comAccel * 0.04,
    comSpeed,
    torqueAnkle,
    torqueKnee,
    torqueHip,
    confidence: conf,
    phase: phaseFrom(torso, knee),
    contactMs: gait?.contactMs ?? null,
    flightMs: gait?.flightMs ?? null,
    strideM: gait?.strideM ?? null,
    cadenceSpm: gait?.cadenceSpm ?? null,
    speedMs: gait?.speedMs ?? null,
    contacting: gait?.contacting ?? false,
  };
}

export function coachingAdvice(s: BiomechSample): { text: string; knee: string; torso: string } {
  const bits: string[] = [];
  let knee = "—";
  let torso = "—";

  if (s.phase === "set") {
    bits.push("Set：髋高于肩，前膝接近直角。这是位置，不是力气。");
  } else if (s.phase === "drive") {
    bits.push("驱动：把地往身后推。第一步短，胸留在前面。");
  } else if (s.phase === "accel") {
    bits.push("加速：逐步抬体，步频先于步幅。动作留在身体前方。");
  } else if (s.phase === "upright") {
    bits.push("途中：髋前送，别在身后捞地。前侧机械。");
  }

  if (s.knee != null) {
    if (s.knee < 105) {
      knee = "过屈";
      bits.push("前膝过度屈曲，离块后伸髋会变慢，打开到 120–140°。");
    } else if (s.knee > 158) {
      knee = "过直";
      bits.push("膝角过大，弹性支撑变差，落地时保持适度缓冲。");
    } else {
      knee = "高效";
      bits.push("膝角在高效区间，保持当前发力节奏。");
    }
  }

  if (s.torso != null) {
    if (s.phase === "drive" || s.phase === "set") {
      if (s.torso < 40) {
        torso = "过早抬体";
        bits.push("躯干抬起过早，水平分力下降。驱动阶段保持 45–70° 前倾。");
      } else if (s.torso > 125) {
        torso = "过低";
        bits.push("躯干过低，可能压住第一步。髋部主动上提。");
      } else {
        torso = "驱动前倾";
      }
    } else {
      torso = s.torso < 28 ? "稳定" : "前倾";
    }
  }

  return { text: bits.join(" ") || "等待姿态数据。", knee, torso };
}

export function predict100m(history: BiomechSample[]): {
  recommended: number;
  planA: number;
  baseline: number;
  conservative: number;
  quality: number;
} {
  const recent = history.slice(-40);
  if (!recent.length) {
    return { recommended: 10.86, planA: 11.04, baseline: 11.28, conservative: 11.52, quality: 0.42 };
  }
  const avg = (fn: (s: BiomechSample) => number) =>
    recent.reduce((a, s) => a + fn(s), 0) / recent.length;
  const power = avg((s) => s.power) / 100;
  const conf = avg((s) => s.confidence);
  const kneeScore = avg((s) => {
    if (s.knee == null) return 0.4;
    return clamp(1 - Math.abs(s.knee - 132) / 50, 0, 1);
  });
  const torsoScore = avg((s) => {
    if (s.torso == null) return 0.4;
    return clamp(1 - Math.abs(s.torso - 52) / 55, 0, 1);
  });
  const quality = clamp(power * 0.4 + kneeScore * 0.3 + torsoScore * 0.2 + conf * 0.1, 0.12, 0.98);
  const t100 = 11.42 - quality * 1.92;
  return {
    recommended: t100 - 0.18,
    planA: t100,
    baseline: t100 + 0.22,
    conservative: t100 + 0.48,
    quality,
  };
}
