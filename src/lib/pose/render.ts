import { JOINT_INDEX, type Landmark, type ViewBox } from "./types";
import { angleAt } from "./biomechanics";

let view: ViewBox = { x: 0, y: 0, w: 1, h: 1 };

const BODY: Array<[number, number]> = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [15, 17],
  [15, 19],
  [15, 21],
  [16, 18],
  [16, 20],
  [16, 22],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [27, 29],
  [27, 31],
  [29, 31],
  [24, 26],
  [26, 28],
  [28, 30],
  [28, 32],
  [30, 32],
];

const HAND_JOINTS = [15, 16, 17, 18, 19, 20, 21, 22];

const CORE_JOINTS = [
  JOINT_INDEX.leftShoulder,
  JOINT_INDEX.rightShoulder,
  JOINT_INDEX.leftElbow,
  JOINT_INDEX.rightElbow,
  JOINT_INDEX.leftWrist,
  JOINT_INDEX.rightWrist,
  JOINT_INDEX.leftHip,
  JOINT_INDEX.rightHip,
  JOINT_INDEX.leftKnee,
  JOINT_INDEX.rightKnee,
  JOINT_INDEX.leftAnkle,
  JOINT_INDEX.rightAnkle,
];

export function resetRenderer() {
  view = { x: 0, y: 0, w: 1, h: 1 };
}

export function updateFollowView() {
  view = { x: 0, y: 0, w: 1, h: 1 };
  return view;
}

let overlayFrame = { ox: 0, oy: 0, dw: 0, dh: 0 };

export function toView(lm: Landmark, w: number, h: number) {
  const dw = overlayFrame.dw || w;
  const dh = overlayFrame.dh || h;
  return {
    x: overlayFrame.ox + ((lm.x - view.x) / view.w) * dw,
    y: overlayFrame.oy + ((lm.y - view.y) / view.h) * dh,
  };
}

export function drawStadium(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#12161e");
  g.addColorStop(0.62, "#0c0e12");
  g.addColorStop(1, "#16141a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const ground = h * 0.88;
  ctx.fillStyle = "#1c1922";
  ctx.fillRect(0, ground, w, h - ground);

  ctx.strokeStyle = "rgba(232,234,238,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, ground);
  ctx.lineTo(w, ground);
  ctx.stroke();

  const startX = w * 0.18;
  ctx.fillStyle = "rgba(232,234,238,0.22)";
  ctx.fillRect(startX, ground - 10, 3, 22);
  ctx.fillStyle = "rgba(142,171,196,0.4)";
  ctx.fillRect(startX - 32, ground - 12, 20, 12);
  ctx.fillRect(startX - 52, ground - 8, 16, 8);
}

export function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
) {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) {
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  const sx = Math.max(0, view.x * vw);
  const sy = Math.max(0, view.y * vh);
  const sw = Math.max(2, Math.min(vw - sx, view.w * vw));
  const sh = Math.max(2, Math.min(vh - sy, view.h * vh));
  ctx.fillStyle = "#0c0e12";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
}

function containRect(vw: number, vh: number, cw: number, ch: number) {
  const va = vw / Math.max(1, vh);
  const ca = cw / Math.max(1, ch);
  if (va > ca) {
    const dw = cw;
    const dh = cw / va;
    return { ox: 0, oy: (ch - dh) / 2, dw, dh };
  }
  const dh = ch;
  const dw = ch * va;
  return { ox: (cw - dw) / 2, oy: 0, dw, dh };
}

function visPt(
  landmarks: Landmark[],
  pts: Array<{ x: number; y: number }>,
  i: number,
  min = 0.38,
) {
  const lm = landmarks[i];
  const p = pts[i];
  if (!p || !lm || (lm.visibility ?? 1) < min) return null;
  return p;
}

function capsule(
  ctx: CanvasRenderingContext2D,
  a: { x: number; y: number },
  b: { x: number; y: number },
  width: number,
  color: string,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function drawAngleArc(
  ctx: CanvasRenderingContext2D,
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
  deg: number,
  color: string,
) {
  const a1 = Math.atan2(a.y - b.y, a.x - b.x);
  const a2 = Math.atan2(c.y - b.y, c.x - b.x);
  let start = a1;
  let end = a2;
  let delta = end - start;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 22, start, start + delta, delta < 0);
  ctx.stroke();
  ctx.fillStyle = "rgba(12,14,18,0.78)";
  const label = `${deg.toFixed(0)}°`;
  ctx.font = "600 12px IBM Plex Mono, monospace";
  const tw = ctx.measureText(label).width;
  ctx.fillRect(b.x + 14, b.y - 10, tw + 10, 20);
  ctx.fillStyle = color;
  ctx.fillText(label, b.x + 19, b.y + 4);
}

function drawLimbBody(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  pts: Array<{ x: number; y: number }>,
  conf: number,
) {
  const a = Math.max(0.45, conf);
  const seg: Array<[number, number, number, string]> = [
    [11, 12, 16, `rgba(142,171,196,${0.28 * a})`],
    [11, 23, 18, `rgba(142,171,196,${0.32 * a})`],
    [12, 24, 18, `rgba(142,171,196,${0.32 * a})`],
    [23, 24, 20, `rgba(142,171,196,${0.38 * a})`],
    [23, 25, 22, `rgba(232,234,238,${0.42 * a})`],
    [24, 26, 22, `rgba(232,234,238,${0.42 * a})`],
    [25, 27, 16, `rgba(142,171,196,${0.5 * a})`],
    [26, 28, 16, `rgba(142,171,196,${0.5 * a})`],
    [27, 31, 10, `rgba(190,214,232,${0.55 * a})`],
    [28, 32, 10, `rgba(190,214,232,${0.55 * a})`],
    [11, 13, 14, `rgba(180,200,216,${0.48 * a})`],
    [12, 14, 14, `rgba(180,200,216,${0.48 * a})`],
    [13, 15, 11, `rgba(190,214,232,${0.55 * a})`],
    [14, 16, 11, `rgba(190,214,232,${0.55 * a})`],
  ];
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  for (const [i, j, width, color] of seg) {
    const pa = visPt(landmarks, pts, i);
    const pb = visPt(landmarks, pts, j);
    if (!pa || !pb) continue;
    capsule(ctx, pa, pb, width, color);
  }
  ctx.restore();
}

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  w: number,
  h: number,
  conf: number,
) {
  const pts = landmarks.map((lm) => toView(lm, w, h));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  drawLimbBody(ctx, landmarks, pts, conf);

  const torso = [
    pts[JOINT_INDEX.leftShoulder],
    pts[JOINT_INDEX.rightShoulder],
    pts[JOINT_INDEX.rightHip],
    pts[JOINT_INDEX.leftHip],
  ];
  if (torso.every(Boolean)) {
    ctx.fillStyle = `rgba(142,171,196,${0.22 * conf})`;
    ctx.beginPath();
    ctx.moveTo(torso[0].x, torso[0].y);
    for (let i = 1; i < torso.length; i++) ctx.lineTo(torso[i].x, torso[i].y);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = `rgba(232, 236, 242, ${0.95 * conf})`;
  ctx.lineWidth = 2.4;
  for (const [i, j] of BODY) {
    const hand = i >= 15 && i <= 22;
    const a = visPt(landmarks, pts, i, hand ? 0.1 : 0.32);
    const b = visPt(landmarks, pts, j, hand ? 0.1 : 0.32);
    if (!a || !b) continue;
    ctx.lineWidth = hand ? 2 : 2.4;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const nose = pts[0];
  const shL = pts[JOINT_INDEX.leftShoulder];
  const shR = pts[JOINT_INDEX.rightShoulder];
  if (nose && shL && shR) {
    const neckX = (shL.x + shR.x) / 2;
    const neckY = (shL.y + shR.y) / 2;
    ctx.strokeStyle = `rgba(232, 236, 242, ${0.92 * conf})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(neckX, neckY);
    ctx.lineTo(nose.x, nose.y);
    ctx.stroke();
    ctx.fillStyle = `rgba(232,236,242,${0.92 * conf})`;
    ctx.beginPath();
    ctx.arc(nose.x, nose.y, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  const highlight = new Set<number>([
    JOINT_INDEX.leftKnee,
    JOINT_INDEX.rightKnee,
    JOINT_INDEX.leftHip,
    JOINT_INDEX.rightHip,
    JOINT_INDEX.leftAnkle,
    JOINT_INDEX.rightAnkle,
    JOINT_INDEX.leftElbow,
    JOINT_INDEX.rightElbow,
  ]);
  for (const i of CORE_JOINTS) {
    const p = visPt(landmarks, pts, i, 0.22);
    if (!p) continue;
    ctx.fillStyle = highlight.has(i) ? "rgba(232,234,238,0.98)" : "rgba(142,171,196,0.95)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, highlight.has(i) ? 8 : 5, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const i of HAND_JOINTS) {
    const p = visPt(landmarks, pts, i, 0.08);
    if (!p) continue;
    ctx.fillStyle = "rgba(232,234,238,0.95)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, i === 15 || i === 16 ? 6 : 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLimbAngles(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  w: number,
  h: number,
) {
  const L = landmarks;
  const pts = L.map((lm) => toView(lm, w, h));
  ctx.textBaseline = "alphabetic";
  const arcs: Array<[number, number, number, string]> = [
    [JOINT_INDEX.leftHip, JOINT_INDEX.leftKnee, JOINT_INDEX.leftAnkle, "#e8eaee"],
    [JOINT_INDEX.rightHip, JOINT_INDEX.rightKnee, JOINT_INDEX.rightAnkle, "#e8eaee"],
    [JOINT_INDEX.leftShoulder, JOINT_INDEX.leftElbow, JOINT_INDEX.leftWrist, "#8eabc4"],
    [JOINT_INDEX.rightShoulder, JOINT_INDEX.rightElbow, JOINT_INDEX.rightWrist, "#8eabc4"],
    [JOINT_INDEX.leftShoulder, JOINT_INDEX.leftHip, JOINT_INDEX.leftKnee, "#7dba9a"],
    [JOINT_INDEX.leftKnee, JOINT_INDEX.leftAnkle, JOINT_INDEX.leftFoot, "#8eabc4"],
  ];
  for (const [ia, ib, ic, color] of arcs) {
    const deg = angleAt(L[ia], L[ib], L[ic]);
    const a = visPt(L, pts, ia);
    const b = visPt(L, pts, ib);
    const c = visPt(L, pts, ic);
    if (deg == null || !a || !b || !c) continue;
    drawAngleArc(ctx, a, b, c, deg, color);
  }
}

function drawCallouts(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  w: number,
  h: number,
  knee: number | null,
  torso: number | null,
) {
  ctx.font = "600 14px Barlow, sans-serif";
  ctx.textBaseline = "middle";
  const kneeLm = landmarks[JOINT_INDEX.rightKnee] ?? landmarks[JOINT_INDEX.leftKnee];
  if (kneeLm && knee != null) {
    const p = toView(kneeLm, w, h);
    const label = `膝 ${knee.toFixed(0)}°`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(12,14,18,0.78)";
    ctx.fillRect(p.x + 12, p.y - 14, tw + 18, 28);
    ctx.fillStyle = "#e8eaee";
    ctx.fillText(label, p.x + 21, p.y);
  }
  const sh = landmarks[JOINT_INDEX.rightShoulder];
  if (sh && torso != null) {
    const p = toView(sh, w, h);
    const label = `躯干 ${torso.toFixed(0)}°`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(12,14,18,0.78)";
    ctx.fillRect(p.x + 12, p.y - 36, tw + 18, 28);
    ctx.fillStyle = "#8eabc4";
    ctx.fillText(label, p.x + 21, p.y - 21);
  }
  const hipLm = landmarks[JOINT_INDEX.rightHip] ?? landmarks[JOINT_INDEX.leftHip];
  if (hipLm) {
    const p = toView(hipLm, w, h);
    const label = "髋";
    ctx.fillStyle = "rgba(12,14,18,0.75)";
    ctx.fillRect(p.x - 22, p.y + 10, 32, 22);
    ctx.fillStyle = "#e8eaee";
    ctx.fillText(label, p.x - 14, p.y + 21);
  }
}

function drawScoreHud(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  score: number | null,
  grade: string | null,
  cue: string | null,
) {
  if (score == null) return;
  const boxW = 132;
  const x = w - boxW - 16;
  const y = 14;
  ctx.fillStyle = "rgba(12,14,18,0.72)";
  ctx.fillRect(x, y, boxW, 58);
  ctx.fillStyle = "#8eabc4";
  ctx.font = "500 11px Barlow, sans-serif";
  ctx.fillText("MILLS 起跑", x + 12, y + 16);
  ctx.fillStyle = "#e8eaee";
  ctx.font = "600 26px IBM Plex Mono, monospace";
  ctx.fillText(score.toFixed(1), x + 12, y + 44);
  ctx.font = "500 12px Barlow, sans-serif";
  ctx.fillStyle = "#8eabc4";
  ctx.fillText(grade ?? "", x + 78, y + 42);

  if (cue) {
    ctx.font = "500 13px Barlow, sans-serif";
    const maxW = w - 32;
    let text = cue;
    while (ctx.measureText(text).width > maxW && text.length > 4) {
      text = text.slice(0, -2);
    }
    const tw = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(12,14,18,0.7)";
    ctx.fillRect(16, h - 40, tw + 20, 26);
    ctx.fillStyle = "#e8eaee";
    ctx.fillText(text, 26, h - 23);
  }
}

export function renderFrame(opts: {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  now: number;
  video: HTMLVideoElement | null;
  mode: "demo" | "camera" | "video";
  landmarks: Landmark[] | null;
  follow: boolean;
  power: number;
  confidence: number;
  knee: number | null;
  torso: number | null;
  reducedMotion: boolean;
  score?: number | null;
  grade?: string | null;
  cue?: string | null;
  overlayOn?: boolean;
}) {
  const { ctx, w, h, video, mode, landmarks, confidence, knee, torso, score, grade, cue } = opts;
  const overlayOn = opts.overlayOn !== false;

  updateFollowView();

  const live =
    mode !== "demo" && !!video && video.videoWidth > 8 && video.videoHeight > 8;

  if (live && video) {
    overlayFrame = containRect(video.videoWidth, video.videoHeight, w, h);
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(0, 0, w, h);
    try {
      ctx.drawImage(video, overlayFrame.ox, overlayFrame.oy, overlayFrame.dw, overlayFrame.dh);
    } catch {
      ctx.clearRect(0, 0, w, h);
    }
  } else if (mode === "demo") {
    overlayFrame = { ox: 0, oy: 0, dw: w, dh: h };
    drawStadium(ctx, w, h);
  } else {
    overlayFrame = { ox: 0, oy: 0, dw: w, dh: h };
    ctx.clearRect(0, 0, w, h);
  }

  if (!overlayOn) {
    return;
  }

  if (!landmarks) {
    drawScoreHud(ctx, w, h, score ?? null, grade ?? null, cue ?? null);
    return;
  }

  drawSkeleton(ctx, landmarks, w, h, Math.max(0.55, confidence));
  drawLimbAngles(ctx, landmarks, w, h);
  drawCallouts(ctx, landmarks, w, h, knee, torso);
  drawScoreHud(ctx, w, h, score ?? null, grade ?? null, cue ?? null);
}
