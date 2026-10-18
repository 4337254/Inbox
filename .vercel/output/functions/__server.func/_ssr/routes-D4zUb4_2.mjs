import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, c as FlipHorizontal2, d as Camera, l as Eye, n as UserRound, o as Play, r as Upload, s as Pause, t as Video, u as EyeOff } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4zUb4_2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CYCLE = 4.2;
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function clamp$2(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function ease(t) {
	return 1 - (1 - t) * (1 - t);
}
function mix(a, b, t) {
	const k = clamp$2(t, 0, 1);
	const out = { ...a };
	Object.keys(a).forEach((key) => {
		out[key] = [lerp(a[key][0], b[key][0], k), lerp(a[key][1], b[key][1], k)];
	});
	return out;
}
function shift(j, dx, dy = 0) {
	const out = { ...j };
	Object.keys(j).forEach((key) => {
		out[key] = [j[key][0] + dx, j[key][1] + dy];
	});
	return out;
}
/** Classic crouch SET, side view, facing right, large in frame. */
var SET = {
	nose: [.5, .4],
	shL: [.46, .5],
	shR: [.5, .48],
	elL: [.5, .68],
	elR: [.54, .66],
	wrL: [.5, .86],
	wrR: [.55, .86],
	hipL: [.34, .36],
	hipR: [.38, .34],
	kL: [.22, .58],
	kR: [.52, .6],
	aL: [.16, .86],
	aR: [.44, .86],
	heelL: [.13, .86],
	heelR: [.4, .86],
	fL: [.2, .88],
	fR: [.5, .88]
};
var CLEAR = {
	nose: [.54, .3],
	shL: [.5, .4],
	shR: [.54, .38],
	elL: [.62, .5],
	elR: [.42, .34],
	wrL: [.7, .58],
	wrR: [.34, .28],
	hipL: [.4, .46],
	hipR: [.44, .44],
	kL: [.3, .64],
	kR: [.58, .5],
	aL: [.22, .86],
	aR: [.52, .7],
	heelL: [.19, .86],
	heelR: [.48, .72],
	fL: [.28, .88],
	fR: [.58, .72]
};
var STEP1 = {
	nose: [.6, .26],
	shL: [.54, .36],
	shR: [.58, .34],
	elL: [.46, .28],
	elR: [.7, .46],
	wrL: [.4, .2],
	wrR: [.78, .56],
	hipL: [.48, .48],
	hipR: [.52, .46],
	kL: [.58, .64],
	kR: [.4, .58],
	aL: [.62, .86],
	aR: [.32, .72],
	heelL: [.58, .86],
	heelR: [.28, .74],
	fL: [.68, .88],
	fR: [.38, .74]
};
var RUN_A = {
	nose: [.7, .2],
	shL: [.64, .3],
	shR: [.68, .28],
	elL: [.54, .24],
	elR: [.8, .4],
	wrL: [.48, .16],
	wrR: [.88, .5],
	hipL: [.6, .46],
	hipR: [.64, .44],
	kL: [.72, .6],
	kR: [.5, .58],
	aL: [.7, .82],
	aR: [.42, .74],
	heelL: [.66, .82],
	heelR: [.38, .76],
	fL: [.76, .84],
	fR: [.48, .76]
};
var RUN_B = {
	nose: [.78, .18],
	shL: [.72, .28],
	shR: [.76, .26],
	elL: [.86, .38],
	elR: [.62, .22],
	wrL: [.94, .48],
	wrR: [.56, .14],
	hipL: [.7, .46],
	hipR: [.74, .44],
	kL: [.6, .58],
	kR: [.84, .58],
	aL: [.5, .76],
	aR: [.82, .8],
	heelL: [.46, .78],
	heelR: [.78, .8],
	fL: [.56, .78],
	fR: [.9, .82]
};
function poseAt(t) {
	if (t < .7) return SET;
	if (t < .92) return mix(SET, CLEAR, ease((t - .7) / .22));
	if (t < 1.28) return mix(CLEAR, STEP1, ease((t - .92) / .36));
	if (t < 1.7) return mix(STEP1, RUN_A, ease((t - 1.28) / .42));
	const u = t - 1.7;
	const cycle = u / .42 % 2;
	const moving = shift(cycle < 1 ? mix(RUN_A, RUN_B, ease(cycle)) : mix(RUN_B, RUN_A, ease(cycle - 1)), Math.min(.12, u * .04));
	if (t > 3.85) return mix(moving, SET, ease((t - 3.85) / .35));
	return moving;
}
function lm(x, y, z = 0) {
	return {
		x,
		y,
		z,
		visibility: 1
	};
}
function sampleSprintPose(timeSec) {
	const p = poseAt((timeSec % CYCLE + CYCLE) % CYCLE);
	const pts = Array.from({ length: 33 }, () => lm(p.nose[0], p.nose[1]));
	pts[0] = lm(p.nose[0], p.nose[1]);
	pts[1] = lm(p.nose[0] - .012, p.nose[1] - .01, .02);
	pts[2] = lm(p.nose[0] - .02, p.nose[1] - .008, .03);
	pts[3] = lm(p.nose[0] - .028, p.nose[1] - .004, .03);
	pts[4] = lm(p.nose[0] + .01, p.nose[1] - .01, -.02);
	pts[5] = lm(p.nose[0] + .018, p.nose[1] - .008, -.03);
	pts[6] = lm(p.nose[0] + .024, p.nose[1] - .004, -.03);
	pts[7] = lm(p.nose[0] - .03, p.nose[1] + .004, .05);
	pts[8] = lm(p.nose[0] + .028, p.nose[1] + .004, -.05);
	pts[9] = lm(p.nose[0] - .008, p.nose[1] + .018);
	pts[10] = lm(p.nose[0] + .01, p.nose[1] + .018);
	pts[11] = lm(p.shL[0], p.shL[1], .05);
	pts[12] = lm(p.shR[0], p.shR[1], -.05);
	pts[13] = lm(p.elL[0], p.elL[1], .06);
	pts[14] = lm(p.elR[0], p.elR[1], -.06);
	pts[15] = lm(p.wrL[0], p.wrL[1], .06);
	pts[16] = lm(p.wrR[0], p.wrR[1], -.06);
	pts[17] = lm(p.wrL[0] + .01, p.wrL[1] + .01, .06);
	pts[18] = lm(p.wrR[0] + .01, p.wrR[1] + .01, -.06);
	pts[19] = lm(p.wrL[0] + .014, p.wrL[1], .06);
	pts[20] = lm(p.wrR[0] + .014, p.wrR[1], -.06);
	pts[21] = lm(p.wrL[0], p.wrL[1] - .008, .06);
	pts[22] = lm(p.wrR[0], p.wrR[1] - .008, -.06);
	pts[23] = lm(p.hipL[0], p.hipL[1], .04);
	pts[24] = lm(p.hipR[0], p.hipR[1], -.04);
	pts[25] = lm(p.kL[0], p.kL[1], .04);
	pts[26] = lm(p.kR[0], p.kR[1], -.04);
	pts[27] = lm(p.aL[0], p.aL[1], .04);
	pts[28] = lm(p.aR[0], p.aR[1], -.04);
	pts[29] = lm(p.heelL[0], p.heelL[1], .04);
	pts[30] = lm(p.heelR[0], p.heelR[1], -.04);
	pts[31] = lm(p.fL[0], p.fL[1], .04);
	pts[32] = lm(p.fR[0], p.fR[1], -.04);
	return pts;
}
var JOINT_INDEX = {
	nose: 0,
	leftShoulder: 11,
	rightShoulder: 12,
	leftElbow: 13,
	rightElbow: 14,
	leftWrist: 15,
	rightWrist: 16,
	leftHip: 23,
	rightHip: 24,
	leftKnee: 25,
	rightKnee: 26,
	leftAnkle: 27,
	rightAnkle: 28,
	leftHeel: 29,
	rightHeel: 30,
	leftFoot: 31,
	rightFoot: 32
};
var MASS = 78;
var G = 9.81;
function clamp$1(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function vis(lm, min = .25) {
	return !!lm && (lm.visibility === void 0 || lm.visibility >= min);
}
function mid(a, b) {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2,
		z: (a.z + b.z) / 2,
		visibility: Math.min(a.visibility, b.visibility)
	};
}
function angleAt(a, b, c) {
	if (!vis(a) || !vis(b) || !vis(c) || !a || !b || !c) return null;
	const abx = a.x - b.x;
	const aby = a.y - b.y;
	const cbx = c.x - b.x;
	const cby = c.y - b.y;
	const mag = Math.hypot(abx, aby) * Math.hypot(cbx, cby);
	if (mag < 1e-6) return null;
	const dot = clamp$1((abx * cbx + aby * cby) / mag, -1, 1);
	return Math.acos(dot) * 180 / Math.PI;
}
/** Torso lean from vertical, degrees. 0 = upright, ~90 = parallel to track. */
function torsoLean(shoulder, hip) {
	if (!vis(shoulder) || !vis(hip) || !shoulder || !hip) return null;
	const dx = shoulder.x - hip.x;
	const dy = shoulder.y - hip.y;
	const fromUp = Math.atan2(dx, -dy);
	return clamp$1(Math.abs(fromUp) * 180 / Math.PI, 0, 180);
}
/** One-Euro: damp jitter when still, snap on sprint motion. No prediction / no coast. */
function smoothingFactor(dt, cutoff) {
	const r = 2 * Math.PI * cutoff * dt;
	return r / (r + 1);
}
var OneEuroAxis = class {
	x = 0;
	dx = 0;
	t = 0;
	ready = false;
	reset() {
		this.ready = false;
		this.dx = 0;
	}
	snap(v, t) {
		this.ready = true;
		this.x = v;
		this.dx = 0;
		this.t = t;
		return v;
	}
	next(v, t, minCutoff, beta) {
		if (!this.ready) {
			this.ready = true;
			this.x = v;
			this.dx = 0;
			this.t = t;
			return v;
		}
		const dt = Math.max(.006, Math.min(.05, (t - this.t) / 1e3));
		this.t = t;
		const edx = (v - this.x) / dt;
		const ad = smoothingFactor(dt, 1);
		this.dx += ad * (edx - this.dx);
		const a = smoothingFactor(dt, minCutoff + beta * Math.abs(this.dx));
		this.x += a * (v - this.x);
		return this.x;
	}
};
var LandmarkFilter = class {
	axes = null;
	last = null;
	reset() {
		this.axes = null;
		this.last = null;
	}
	next(raw, t) {
		if (!this.axes || this.axes.length !== raw.length * 2) this.axes = Array.from({ length: raw.length * 2 }, () => new OneEuroAxis());
		const out = raw.map((q, i) => {
			const held = this.last?.[i];
			if ((q.visibility ?? 1) < .22 && held) return {
				...held,
				visibility: q.visibility
			};
			const jump = held != null && Math.hypot(q.x - held.x, q.y - held.y) > .018;
			return {
				x: jump ? this.axes[i * 2].snap(q.x, t) : this.axes[i * 2].next(q.x, t, 3.2, .08),
				y: jump ? this.axes[i * 2 + 1].snap(q.y, t) : this.axes[i * 2 + 1].next(q.y, t, 3.2, .08),
				z: q.z,
				visibility: q.visibility
			};
		});
		this.last = out;
		return out;
	}
};
/** True only for a real body (shoulders + hips + at least one leg). Rejects faces, blobs, noise. */
function isHumanPose(landmarks) {
	if (!landmarks || landmarks.length < 27) return false;
	const shL = landmarks[JOINT_INDEX.leftShoulder];
	const shR = landmarks[JOINT_INDEX.rightShoulder];
	const hipL = landmarks[JOINT_INDEX.leftHip];
	const hipR = landmarks[JOINT_INDEX.rightHip];
	if (!vis(shL, .28) || !vis(shR, .28) || !vis(hipL, .24) || !vis(hipR, .24)) return false;
	const shoulderW = Math.hypot(shL.x - shR.x, shL.y - shR.y);
	const hipW = Math.hypot(hipL.x - hipR.x, hipL.y - hipR.y);
	const midSh = mid(shL, shR);
	const midHip = mid(hipL, hipR);
	const torsoLen = Math.hypot(midSh.x - midHip.x, midSh.y - midHip.y);
	if (shoulderW < .02 || hipW < .015 || torsoLen < .035 || torsoLen > .85) return false;
	if (shoulderW > torsoLen * 3.4) return false;
	const kL = landmarks[JOINT_INDEX.leftKnee];
	const kR = landmarks[JOINT_INDEX.rightKnee];
	const aL = landmarks[JOINT_INDEX.leftAnkle];
	const aR = landmarks[JOINT_INDEX.rightAnkle];
	if (Number(vis(kL, .2)) + Number(vis(kR, .2)) + Number(vis(aL, .18)) + Number(vis(aR, .18)) < 1) return false;
	return poseConfidence(landmarks) >= .26;
}
/** Stay locked on a body even if one joint dips for a few frames. */
function isTrackedHuman(landmarks, locked) {
	if (isHumanPose(landmarks)) return true;
	if (!locked) return false;
	return poseConfidence(landmarks) >= .2;
}
var GaitTracker = class {
	contacting = false;
	contactStart = 0;
	flightStart = 0;
	lastStepT = 0;
	lastHipX = 0;
	prevHipX = 0;
	prevT = 0;
	groundY = .82;
	contactMs = null;
	flightMs = null;
	strideM = null;
	cadenceSpm = null;
	speedMs = null;
	reset() {
		this.contacting = false;
		this.contactStart = 0;
		this.flightStart = 0;
		this.lastStepT = 0;
		this.lastHipX = 0;
		this.prevHipX = 0;
		this.prevT = 0;
		this.groundY = .82;
		this.contactMs = null;
		this.flightMs = null;
		this.strideM = null;
		this.cadenceSpm = null;
		this.speedMs = null;
	}
	update(landmarks, t) {
		const hipL = landmarks[JOINT_INDEX.leftHip];
		const hipR = landmarks[JOINT_INDEX.rightHip];
		const shL = landmarks[JOINT_INDEX.leftShoulder];
		const shR = landmarks[JOINT_INDEX.rightShoulder];
		const aL = landmarks[JOINT_INDEX.leftAnkle];
		const aR = landmarks[JOINT_INDEX.rightAnkle];
		if (!hipL || !hipR || !aL || !aR) return;
		const hip = mid(hipL, hipR);
		const torsoLen = vis(shL) && vis(shR) && shL && shR ? Math.hypot(mid(shL, shR).x - hip.x, mid(shL, shR).y - hip.y) : .18;
		const meters = torsoLen > .03 ? .48 / torsoLen : 1.6;
		const footY = Math.max(vis(aL, .2) ? aL.y : 0, vis(aR, .2) ? aR.y : 0);
		if (footY > .35) this.groundY = this.groundY * .9 + footY * .1;
		const nowContact = footY >= this.groundY - .02 && footY > hip.y + .04;
		if (this.prevT > 0) {
			const dt = (t - this.prevT) / 1e3;
			if (dt > .005 && dt < .25) {
				const v = Math.abs(hip.x - this.prevHipX) / dt * meters;
				this.speedMs = this.speedMs == null ? v : this.speedMs * .65 + v * .35;
			}
		}
		if (nowContact && !this.contacting) {
			if (this.flightStart > 0) this.flightMs = t - this.flightStart;
			if (this.lastStepT > 0) {
				const step = (t - this.lastStepT) / 1e3;
				if (step > .12 && step < .7) {
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
};
function poseConfidence(landmarks) {
	if (!landmarks.length) return 0;
	const core = [
		JOINT_INDEX.leftShoulder,
		JOINT_INDEX.rightShoulder,
		JOINT_INDEX.leftHip,
		JOINT_INDEX.rightHip,
		JOINT_INDEX.leftKnee,
		JOINT_INDEX.rightKnee
	];
	let s = 0;
	for (const i of core) s += landmarks[i]?.visibility ?? 0;
	return s / core.length;
}
function phaseFrom(torso, knee) {
	if (torso == null) return "unknown";
	if (torso > 95 && knee != null && knee < 140) return "set";
	if (torso > 55) return "drive";
	if (torso > 28) return "accel";
	return "upright";
}
function analyzePose(landmarks, prev, t, gait) {
	const L = landmarks;
	const hipL = L[JOINT_INDEX.leftHip];
	const hipR = L[JOINT_INDEX.rightHip];
	const shL = L[JOINT_INDEX.leftShoulder];
	const shR = L[JOINT_INDEX.rightShoulder];
	const kneeL = angleAt(hipL, L[JOINT_INDEX.leftKnee], L[JOINT_INDEX.leftAnkle]);
	const kneeR = angleAt(hipR, L[JOINT_INDEX.rightKnee], L[JOINT_INDEX.rightAnkle]);
	const knee = kneeL != null && kneeR != null ? Math.min(kneeL, kneeR) : kneeL ?? kneeR;
	const shoulder = vis(shL) && vis(shR) && shL && shR ? mid(shL, shR) : shL ?? shR;
	const hip = vis(hipL) && vis(hipR) && hipL && hipR ? mid(hipL, hipR) : hipL ?? hipR;
	const torso = torsoLean(shoulder, hip);
	const hipAngle = angleAt(shL ?? shR, hip, L[JOINT_INDEX.leftKnee] ?? L[JOINT_INDEX.rightKnee]);
	const ankle = angleAt(L[JOINT_INDEX.leftKnee], L[JOINT_INDEX.leftAnkle], L[JOINT_INDEX.leftFoot]);
	const shoulderHip = vis(shL) && vis(hipL) && shL && hipL ? Math.atan2(hipL.y - shL.y, hipL.x - shL.x) * 180 / Math.PI : null;
	let comAccel = 0;
	let comSpeed = 0;
	if (hip && prev?.landmarks.length) {
		const pHipL = prev.landmarks[JOINT_INDEX.leftHip];
		const pHipR = prev.landmarks[JOINT_INDEX.rightHip];
		const pHip = vis(pHipL) && vis(pHipR) && pHipL && pHipR ? mid(pHipL, pHipR) : pHipL ?? pHipR;
		const dt = Math.max(.008, (t - prev.t) / 1e3);
		if (pHip) {
			const vx = (hip.x - pHip.x) / dt;
			const vy = (hip.y - pHip.y) / dt;
			comSpeed = Math.hypot(vx, vy);
			comAccel = comSpeed / Math.max(dt, .016);
		}
	}
	const conf = poseConfidence(landmarks);
	const kneeTarget = 132;
	const torsoTarget = 48;
	const kneeScore = knee != null ? clamp$1(1 - Math.abs(knee - kneeTarget) / 50, 0, 1) : 0;
	const torsoScore = torso != null ? clamp$1(1 - Math.abs(torso - torsoTarget) / 55, 0, 1) : 0;
	const explode = clamp$1(comSpeed * .35, 0, 1);
	const power = clamp$1(kneeScore * 42 + torsoScore * 33 + explode * 25, 0, 100);
	const flex = knee != null ? (180 - knee) * Math.PI / 180 : .6;
	const torqueKnee = MASS * .22 * G * Math.sin(flex) * .42;
	const torqueHip = MASS * .28 * G * Math.sin((torso ?? 40) * Math.PI / 180) * .38;
	const torqueAnkle = MASS * .12 * G * Math.sin(flex * .7) * .28;
	const grf = MASS * (G + clamp$1(comAccel * .08, 0, 18));
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
		comAccel: comAccel * .04,
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
		contacting: gait?.contacting ?? false
	};
}
function coachingAdvice(s) {
	const bits = [];
	let knee = "—";
	let torso = "—";
	if (s.phase === "set") bits.push("Set：髋高于肩，前膝接近直角。这是位置，不是力气。");
	else if (s.phase === "drive") bits.push("驱动：把地往身后推。第一步短，胸留在前面。");
	else if (s.phase === "accel") bits.push("加速：逐步抬体，步频先于步幅。动作留在身体前方。");
	else if (s.phase === "upright") bits.push("途中：髋前送，别在身后捞地。前侧机械。");
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
			} else torso = "驱动前倾";
		} else torso = s.torso < 28 ? "稳定" : "前倾";
	}
	return {
		text: bits.join(" ") || "等待姿态数据。",
		knee,
		torso
	};
}
function predict100m(history) {
	const recent = history.slice(-40);
	if (!recent.length) return {
		recommended: 10.86,
		planA: 11.04,
		baseline: 11.28,
		conservative: 11.52,
		quality: .42
	};
	const avg = (fn) => recent.reduce((a, s) => a + fn(s), 0) / recent.length;
	const power = avg((s) => s.power) / 100;
	const conf = avg((s) => s.confidence);
	const kneeScore = avg((s) => {
		if (s.knee == null) return .4;
		return clamp$1(1 - Math.abs(s.knee - 132) / 50, 0, 1);
	});
	const torsoScore = avg((s) => {
		if (s.torso == null) return .4;
		return clamp$1(1 - Math.abs(s.torso - 52) / 55, 0, 1);
	});
	const quality = clamp$1(power * .4 + kneeScore * .3 + torsoScore * .2 + conf * .1, .12, .98);
	const t100 = 11.42 - quality * 1.92;
	return {
		recommended: t100 - .18,
		planA: t100,
		baseline: t100 + .22,
		conservative: t100 + .48,
		quality
	};
}
var view = {
	x: 0,
	y: 0,
	w: 1,
	h: 1
};
var BODY = [
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
	[30, 32]
];
var HAND_JOINTS = [
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22
];
var CORE_JOINTS = [
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
	JOINT_INDEX.rightAnkle
];
function resetRenderer() {
	view = {
		x: 0,
		y: 0,
		w: 1,
		h: 1
	};
}
function updateFollowView() {
	view = {
		x: 0,
		y: 0,
		w: 1,
		h: 1
	};
	return view;
}
var overlayFrame = {
	ox: 0,
	oy: 0,
	dw: 0,
	dh: 0
};
function toView(lm, w, h) {
	const dw = overlayFrame.dw || w;
	const dh = overlayFrame.dh || h;
	return {
		x: overlayFrame.ox + (lm.x - view.x) / view.w * dw,
		y: overlayFrame.oy + (lm.y - view.y) / view.h * dh
	};
}
function drawStadium(ctx, w, h) {
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, "#12161e");
	g.addColorStop(.62, "#0c0e12");
	g.addColorStop(1, "#16141a");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const ground = h * .88;
	ctx.fillStyle = "#1c1922";
	ctx.fillRect(0, ground, w, h - ground);
	ctx.strokeStyle = "rgba(232,234,238,0.16)";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, ground);
	ctx.lineTo(w, ground);
	ctx.stroke();
	const startX = w * .18;
	ctx.fillStyle = "rgba(232,234,238,0.22)";
	ctx.fillRect(startX, ground - 10, 3, 22);
	ctx.fillStyle = "rgba(142,171,196,0.4)";
	ctx.fillRect(startX - 32, ground - 12, 20, 12);
	ctx.fillRect(startX - 52, ground - 8, 16, 8);
}
function containRect(vw, vh, cw, ch) {
	const va = vw / Math.max(1, vh);
	if (va > cw / Math.max(1, ch)) {
		const dw = cw;
		const dh = cw / va;
		return {
			ox: 0,
			oy: (ch - dh) / 2,
			dw,
			dh
		};
	}
	const dh = ch;
	const dw = ch * va;
	return {
		ox: (cw - dw) / 2,
		oy: 0,
		dw,
		dh
	};
}
function visPt(landmarks, pts, i, min = .38) {
	const lm = landmarks[i];
	const p = pts[i];
	if (!p || !lm || (lm.visibility ?? 1) < min) return null;
	return p;
}
function capsule(ctx, a, b, width, color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
}
function drawAngleArc(ctx, a, b, c, deg, color) {
	const a1 = Math.atan2(a.y - b.y, a.x - b.x);
	const a2 = Math.atan2(c.y - b.y, c.x - b.x);
	let start = a1;
	let delta = a2 - start;
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
function drawLimbBody(ctx, landmarks, pts, conf) {
	const a = Math.max(.45, conf);
	const seg = [
		[
			11,
			12,
			16,
			`rgba(142,171,196,${.28 * a})`
		],
		[
			11,
			23,
			18,
			`rgba(142,171,196,${.32 * a})`
		],
		[
			12,
			24,
			18,
			`rgba(142,171,196,${.32 * a})`
		],
		[
			23,
			24,
			20,
			`rgba(142,171,196,${.38 * a})`
		],
		[
			23,
			25,
			22,
			`rgba(232,234,238,${.42 * a})`
		],
		[
			24,
			26,
			22,
			`rgba(232,234,238,${.42 * a})`
		],
		[
			25,
			27,
			16,
			`rgba(142,171,196,${.5 * a})`
		],
		[
			26,
			28,
			16,
			`rgba(142,171,196,${.5 * a})`
		],
		[
			27,
			31,
			10,
			`rgba(190,214,232,${.55 * a})`
		],
		[
			28,
			32,
			10,
			`rgba(190,214,232,${.55 * a})`
		],
		[
			11,
			13,
			14,
			`rgba(180,200,216,${.48 * a})`
		],
		[
			12,
			14,
			14,
			`rgba(180,200,216,${.48 * a})`
		],
		[
			13,
			15,
			11,
			`rgba(190,214,232,${.55 * a})`
		],
		[
			14,
			16,
			11,
			`rgba(190,214,232,${.55 * a})`
		]
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
function drawSkeleton(ctx, landmarks, w, h, conf) {
	const pts = landmarks.map((lm) => toView(lm, w, h));
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	drawLimbBody(ctx, landmarks, pts, conf);
	const torso = [
		pts[JOINT_INDEX.leftShoulder],
		pts[JOINT_INDEX.rightShoulder],
		pts[JOINT_INDEX.rightHip],
		pts[JOINT_INDEX.leftHip]
	];
	if (torso.every(Boolean)) {
		ctx.fillStyle = `rgba(142,171,196,${.22 * conf})`;
		ctx.beginPath();
		ctx.moveTo(torso[0].x, torso[0].y);
		for (let i = 1; i < torso.length; i++) ctx.lineTo(torso[i].x, torso[i].y);
		ctx.closePath();
		ctx.fill();
	}
	ctx.strokeStyle = `rgba(232, 236, 242, ${.95 * conf})`;
	ctx.lineWidth = 2.4;
	for (const [i, j] of BODY) {
		const hand = i >= 15 && i <= 22;
		const a = visPt(landmarks, pts, i, hand ? .1 : .32);
		const b = visPt(landmarks, pts, j, hand ? .1 : .32);
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
		ctx.strokeStyle = `rgba(232, 236, 242, ${.92 * conf})`;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(neckX, neckY);
		ctx.lineTo(nose.x, nose.y);
		ctx.stroke();
		ctx.fillStyle = `rgba(232,236,242,${.92 * conf})`;
		ctx.beginPath();
		ctx.arc(nose.x, nose.y, 11, 0, Math.PI * 2);
		ctx.fill();
	}
	const highlight = /* @__PURE__ */ new Set([
		JOINT_INDEX.leftKnee,
		JOINT_INDEX.rightKnee,
		JOINT_INDEX.leftHip,
		JOINT_INDEX.rightHip,
		JOINT_INDEX.leftAnkle,
		JOINT_INDEX.rightAnkle,
		JOINT_INDEX.leftElbow,
		JOINT_INDEX.rightElbow
	]);
	for (const i of CORE_JOINTS) {
		const p = visPt(landmarks, pts, i, .22);
		if (!p) continue;
		ctx.fillStyle = highlight.has(i) ? "rgba(232,234,238,0.98)" : "rgba(142,171,196,0.95)";
		ctx.beginPath();
		ctx.arc(p.x, p.y, highlight.has(i) ? 8 : 5, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const i of HAND_JOINTS) {
		const p = visPt(landmarks, pts, i, .08);
		if (!p) continue;
		ctx.fillStyle = "rgba(232,234,238,0.95)";
		ctx.beginPath();
		ctx.arc(p.x, p.y, i === 15 || i === 16 ? 6 : 3.5, 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawLimbAngles(ctx, landmarks, w, h) {
	const L = landmarks;
	const pts = L.map((lm) => toView(lm, w, h));
	ctx.textBaseline = "alphabetic";
	const arcs = [
		[
			JOINT_INDEX.leftHip,
			JOINT_INDEX.leftKnee,
			JOINT_INDEX.leftAnkle,
			"#e8eaee"
		],
		[
			JOINT_INDEX.rightHip,
			JOINT_INDEX.rightKnee,
			JOINT_INDEX.rightAnkle,
			"#e8eaee"
		],
		[
			JOINT_INDEX.leftShoulder,
			JOINT_INDEX.leftElbow,
			JOINT_INDEX.leftWrist,
			"#8eabc4"
		],
		[
			JOINT_INDEX.rightShoulder,
			JOINT_INDEX.rightElbow,
			JOINT_INDEX.rightWrist,
			"#8eabc4"
		],
		[
			JOINT_INDEX.leftShoulder,
			JOINT_INDEX.leftHip,
			JOINT_INDEX.leftKnee,
			"#7dba9a"
		],
		[
			JOINT_INDEX.leftKnee,
			JOINT_INDEX.leftAnkle,
			JOINT_INDEX.leftFoot,
			"#8eabc4"
		]
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
function drawCallouts(ctx, landmarks, w, h, knee, torso) {
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
function drawScoreHud(ctx, w, h, score, grade, cue) {
	if (score == null) return;
	const boxW = 132;
	const x = w - boxW - 16;
	const y = 14;
	ctx.fillStyle = "rgba(12,14,18,0.72)";
	ctx.fillRect(x, y, boxW, 58);
	ctx.fillStyle = "#8eabc4";
	ctx.font = "500 11px Barlow, sans-serif";
	ctx.fillText("MILLS 起跑", x + 12, 30);
	ctx.fillStyle = "#e8eaee";
	ctx.font = "600 26px IBM Plex Mono, monospace";
	ctx.fillText(score.toFixed(1), x + 12, 58);
	ctx.font = "500 12px Barlow, sans-serif";
	ctx.fillStyle = "#8eabc4";
	ctx.fillText(grade ?? "", x + 78, 56);
	if (cue) {
		ctx.font = "500 13px Barlow, sans-serif";
		const maxW = w - 32;
		let text = cue;
		while (ctx.measureText(text).width > maxW && text.length > 4) text = text.slice(0, -2);
		const tw = ctx.measureText(text).width;
		ctx.fillStyle = "rgba(12,14,18,0.7)";
		ctx.fillRect(16, h - 40, tw + 20, 26);
		ctx.fillStyle = "#e8eaee";
		ctx.fillText(text, 26, h - 23);
	}
}
function renderFrame(opts) {
	const { ctx, w, h, video, mode, landmarks, confidence, knee, torso, score, grade, cue } = opts;
	const overlayOn = opts.overlayOn !== false;
	updateFollowView();
	if (mode !== "demo" && !!video && video.videoWidth > 8 && video.videoHeight > 8 && video) {
		overlayFrame = containRect(video.videoWidth, video.videoHeight, w, h);
		ctx.fillStyle = "#0c0e12";
		ctx.fillRect(0, 0, w, h);
		try {
			ctx.drawImage(video, overlayFrame.ox, overlayFrame.oy, overlayFrame.dw, overlayFrame.dh);
		} catch {
			ctx.clearRect(0, 0, w, h);
		}
	} else if (mode === "demo") {
		overlayFrame = {
			ox: 0,
			oy: 0,
			dw: w,
			dh: h
		};
		drawStadium(ctx, w, h);
	} else {
		overlayFrame = {
			ox: 0,
			oy: 0,
			dw: w,
			dh: h
		};
		ctx.clearRect(0, 0, w, h);
	}
	if (!overlayOn) return;
	if (!landmarks) {
		drawScoreHud(ctx, w, h, score ?? null, grade ?? null, cue ?? null);
		return;
	}
	drawSkeleton(ctx, landmarks, w, h, Math.max(.55, confidence));
	drawLimbAngles(ctx, landmarks, w, h);
	drawCallouts(ctx, landmarks, w, h, knee, torso);
	drawScoreHud(ctx, w, h, score ?? null, grade ?? null, cue ?? null);
}
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function avg(xs) {
	if (!xs.length) return 0;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function scoreBand(value, ideal, width) {
	return clamp(1 - Math.abs(value - ideal) / width, 0, 1) * 10;
}
function gradeOf(n) {
	if (n >= 9.2) return "世界级位置";
	if (n >= 8.4) return "精英";
	if (n >= 7.5) return "优秀";
	if (n >= 6.5) return "扎实";
	if (n >= 5.5) return "能用";
	if (n >= 4.5) return "走形";
	return "重做这次";
}
function scoreMills(history) {
	const recent = history.slice(-56);
	const empty = {
		overall: 0,
		set: 0,
		clearance: 0,
		projection: 0,
		firstStep: 0,
		arms: 0,
		frontSide: 0,
		grade: "—",
		cue: "先把人完整拍进画面。位置不对，力就使不上。",
		notes: []
	};
	if (recent.length < 4) return empty;
	const setFrames = recent.filter((s) => s.phase === "set");
	const driveFrames = recent.filter((s) => s.phase === "drive" || s.phase === "accel");
	const runFrames = recent.filter((s) => s.phase !== "unknown" && s.confidence > .28);
	const live = recent.filter((s) => s.confidence > .28);
	const body = runFrames.length ? runFrames : live;
	const setKnee = avg(setFrames.map((s) => s.knee ?? 0).filter(Boolean));
	const setTorso = avg(setFrames.map((s) => s.torso ?? 0).filter(Boolean));
	const setScore = setFrames.length ? clamp(scoreBand(setKnee || 100, 96, 26) * .55 + scoreBand(setTorso || 120, 122, 38) * .45, 0, 10) : scoreBand(avg(recent.map((s) => s.knee ?? 120)), 110, 40);
	const driveTorso = avg(driveFrames.map((s) => s.torso ?? 0).filter(Boolean));
	const drivePower = avg(driveFrames.map((s) => s.power));
	const popUp = driveFrames.filter((s) => (s.torso ?? 90) < 32).length / Math.max(1, driveFrames.length);
	const projection = driveFrames.length ? clamp(scoreBand(driveTorso || 48, 46, 24) * .72 + (1 - popUp) * 3.1, 0, 10) : scoreBand(avg(recent.map((s) => s.torso ?? 50)), 50, 30);
	const speeds = body.map((s) => s.comSpeed);
	const meanSp = avg(speeds);
	const reach = speeds.filter((v) => v > meanSp * 1.42).length / Math.max(1, speeds.length);
	const firstStep = clamp(7.1 + (avg(body.map((s) => s.power)) || drivePower) / 100 * 3.3 - reach * 4.8, 0, 10);
	const clearance = clamp((drivePower || avg(body.map((s) => s.power))) / 100 * 6.4 + scoreBand(avg((driveFrames.length ? driveFrames : body).map((s) => s.knee ?? 140)), 148, 32) * .38, 0, 10);
	const hipSwing = avg(body.map((s) => Math.abs(s.shoulderHip ?? 0)));
	const arms = clamp(5.4 + Math.min(3.4, hipSwing / 38) + (drivePower || avg(body.map((s) => s.power))) / 100 * 1.6, 0, 10);
	const frontSide = clamp(scoreBand(avg(body.map((s) => s.knee ?? 130)), 108, 36) * .55 + (1 - reach) * 4.2, 0, 10);
	const overall = clamp(setScore * .16 + clearance * .16 + projection * .26 + firstStep * .18 + arms * .12 + frontSide * .12, 0, 10);
	const notes = [];
	let cue = "位置对了，力才会进跑道。把地往身后推。";
	if (setFrames.length && setKnee && setKnee < 84) {
		notes.push("Set：你在坐。Mills 要髋高于肩、肩在手的正上方、前膝接近直角。蹲太深，力推不出去。");
		cue = "Set 把髋抬起来。别坐进起跑器。";
	} else if (setFrames.length && setKnee > 128) {
		notes.push("Set：前腿太直，肌腱没预加载。前膝再屈，像压紧一根弹簧，而不是站在块上。");
		cue = "Set 再屈一点前膝。先把力存进去。";
	} else if (setFrames.length) notes.push("Set 位髋高、前膝有角度。这是能把力打进跑道的位置，不是在比谁蹲得低。");
	if (popUp > .26) {
		notes.push("离块后你在站起来。前十米继续投影：眼睛看跑道三到五米处，胸留在髋的前面。站直 = 水平力消失。");
		cue = "别站直。胸留在前面，继续往前推。";
	} else if (driveTorso > 80) {
		notes.push("躯干压得过低，第一步会被自己挡住。髋上提，头不要先抬。推，不是跳。");
		cue = "投影可以，别把第一步压死。推地，不要跳起来。";
	} else if (driveFrames.length) notes.push("驱动阶段还在工作角度。把地往后推，不要去够前面的地面。");
	if (reach > .2) {
		notes.push("第一步在够地面。Mills：脚落在髋下，短、狠、向后。步子太大，重心就掉在脚后面。");
		cue = "第一步太大。推地，不要去够地。";
	} else notes.push("步长没有去够，重心在支撑脚上面。地面留在身后，发力方向是对的。");
	if (frontSide < 6.2) {
		notes.push("前侧机械不够：大腿没抬起来，小腿就甩出去了。动作发生在身体前面——先抬膝，再下压，脚背勾起。");
		cue = "先抬膝。正面机械，不要在身后捞地。";
	} else notes.push("前侧位置还在：膝在前面工作。继续把动作留在身体前方，不要在身后捞。");
	if (arms < 6.2) notes.push("摆臂短、碎、横。手臂是杠杆：脸颊到髋槽，前后打，肩放松。左右砍只会把髋带歪。");
	else notes.push("摆臂有长度，对侧配合能把髋带出去。手走长线，不要在胸前打断。");
	if (overall >= 8.4) cue = "这像一次能用的起跑。保持投影，第三步也不要站直。";
	else if (overall >= 7.2) cue = "位置大体对。把第一步再收短，力就会更干净。";
	else if (overall > 0 && notes.length === 0) cue = "把完整的 Set → 离块 → 前三步拍进画面，我按位置打分，不按秒表。";
	return {
		overall: Number(overall.toFixed(1)),
		set: Number(setScore.toFixed(1)),
		clearance: Number(clearance.toFixed(1)),
		projection: Number(projection.toFixed(1)),
		firstStep: Number(firstStep.toFixed(1)),
		arms: Number(arms.toFixed(1)),
		frontSide: Number(frontSide.toFixed(1)),
		grade: gradeOf(overall),
		cue,
		notes: notes.slice(0, 5)
	};
}
var useLabStore = create((set) => ({
	tab: "live",
	mode: "demo",
	facing: "environment",
	fps: 0,
	latencyMs: 0,
	modelStatus: "演示就绪",
	sourceLabel: "运动学演示 · 起跑循环",
	error: null,
	followAthlete: false,
	overlayOn: true,
	analysisFps: 0,
	playbackRate: 1,
	videoDuration: 0,
	videoTime: 0,
	paused: false,
	openingVideo: false,
	recording: false,
	sample: null,
	history: [],
	logs: [],
	advice: "演示起跑已开始，骨骼与力矩正在写入报告。",
	kneeStatus: "—",
	torsoStatus: "—",
	mills: null,
	setTab: (tab) => set({ tab }),
	setFollow: (followAthlete) => set({ followAthlete }),
	setOverlay: (overlayOn) => set({ overlayOn }),
	setAnalysisFps: (analysisFps) => set({ analysisFps }),
	setPlaybackRate: (playbackRate) => set({ playbackRate }),
	setFacing: (facing) => set({ facing }),
	setError: (error) => set({ error }),
	setModelStatus: (modelStatus) => set({ modelStatus }),
	setPaused: (paused) => set({ paused }),
	setOpeningVideo: (openingVideo) => set({ openingVideo }),
	setRecording: (recording) => set({ recording }),
	setVideoMeta: (meta) => set({
		videoDuration: meta.duration,
		paused: meta.paused
	}),
	setSource: ({ mode, sourceLabel, error }) => set({
		mode,
		sourceLabel,
		error,
		history: [],
		sample: null,
		mills: null
	}),
	applyFrame: (p) => set((s) => {
		const history = p.sample ? s.history.length >= 96 ? [...s.history.slice(-95), p.sample] : [...s.history, p.sample] : s.history;
		const logs = p.log ? [p.log, ...s.logs].slice(0, 14) : s.logs;
		return {
			fps: p.fps,
			latencyMs: p.latencyMs,
			sample: p.sample,
			advice: p.advice,
			kneeStatus: p.kneeStatus,
			torsoStatus: p.torsoStatus,
			videoTime: p.videoTime,
			videoDuration: p.videoDuration,
			paused: p.paused,
			history,
			logs,
			mills: scoreMills(history)
		};
	}),
	clearLogs: () => set({ logs: [] })
}));
var VIDEO_EXT = /\.(mp4|m4v|mov|qt|webm|mkv|avi|3gp|mpeg|mpg|hevc)$/i;
function toLandmarks(raw) {
	return raw.map((p) => ({
		x: p.x,
		y: p.y,
		z: p.z ?? 0,
		visibility: p.visibility ?? 1
	}));
}
function waitUntilPlayable(video, ms) {
	return new Promise((resolve, reject) => {
		let done = false;
		const finish = (ok, reason) => {
			if (done) return;
			done = true;
			window.clearTimeout(timer);
			video.removeEventListener("loadeddata", onOk);
			video.removeEventListener("canplay", onOk);
			video.removeEventListener("loadedmetadata", onOk);
			video.removeEventListener("playing", onOk);
			video.removeEventListener("error", onErr);
			if (ok) resolve();
			else reject(new Error(reason || "load"));
		};
		const onOk = () => {
			if (video.readyState >= 2 || video.videoWidth > 0) finish(true);
		};
		const onErr = () => finish(false, "error");
		const timer = window.setTimeout(() => {
			if (video.readyState >= 2 && video.videoWidth > 0) finish(true);
			else finish(false, "timeout");
		}, ms);
		video.addEventListener("loadeddata", onOk);
		video.addEventListener("canplay", onOk);
		video.addEventListener("loadedmetadata", onOk);
		video.addEventListener("playing", onOk);
		video.addEventListener("error", onErr);
		onOk();
	});
}
var PoseEngine = class {
	video = null;
	canvas = null;
	ctx = null;
	landmarker = null;
	raf = 0;
	rvfc = 0;
	running = false;
	busy = false;
	mode = "demo";
	stream = null;
	objectUrl = null;
	facing = "environment";
	follow = false;
	lastPoseAt = 0;
	displayLm = null;
	targetLm = null;
	lastChase = 0;
	rawLm = null;
	prevFrame = null;
	filter = new LandmarkFilter();
	lastUi = 0;
	lastLog = 0;
	frames = 0;
	fpsWindow = 0;
	fps = 0;
	inferMs = 0;
	demoStart = 0;
	cssW = 0;
	cssH = 0;
	reduced = false;
	modelPromise = null;
	lastVideoTime = -1;
	lastDetectStart = 0;
	detectFails = 0;
	poseTs = 1;
	miss = 0;
	locked = false;
	gait = new GaitTracker();
	drawN = 0;
	shot = null;
	shotCtx = null;
	recorder = null;
	recChunks = [];
	recTimer = 0;
	detectTimer = 0;
	stage = null;
	attach(video, canvas, stage) {
		this.video = video;
		this.canvas = canvas;
		this.stage = stage ?? canvas.parentElement;
		this.ctx = canvas.getContext("2d", { alpha: true });
		this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		this.running = true;
		this.demoStart = performance.now();
		this.fpsWindow = performance.now();
		this.ensureSize();
		this.loop();
		useLabStore.getState().setModelStatus("演示就绪");
		(typeof window.requestIdleCallback === "function" ? (cb) => window.requestIdleCallback(cb, { timeout: 1800 }) : (cb) => window.setTimeout(cb, 400))(() => {
			if (this.running) this.ensureModel();
		});
	}
	destroy() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		window.clearTimeout(this.detectTimer);
		this.detectTimer = 0;
		this.stopRecording(false);
		this.cancelRvfc();
		this.stopMedia();
		try {
			this.landmarker?.close();
		} catch {}
		this.landmarker = null;
		resetRenderer();
	}
	setFollow(on) {
		this.follow = on;
		useLabStore.getState().setFollow(on);
	}
	setPlaybackRate(rate) {
		if (this.video) this.video.playbackRate = rate;
		useLabStore.getState().setPlaybackRate(rate);
		useLabStore.getState().setAnalysisFps(0);
	}
	setAnalysisFps(fps) {
		const n = Math.max(1, Math.min(10, Math.round(fps)));
		if (this.video) this.video.playbackRate = n / 30;
		useLabStore.getState().setAnalysisFps(n);
		useLabStore.getState().setPlaybackRate(n / 30);
	}
	setOverlay(on) {
		useLabStore.getState().setOverlay(on);
		if (on) return;
		if (this.video && this.mode === "video") {
			this.video.playbackRate = 1;
			useLabStore.getState().setPlaybackRate(1);
			useLabStore.getState().setAnalysisFps(0);
		}
	}
	async startDemo() {
		this.stopRecording(false);
		window.clearTimeout(this.detectTimer);
		this.detectTimer = 0;
		this.stopMedia();
		this.mode = "demo";
		this.follow = false;
		this.demoStart = performance.now();
		this.displayLm = null;
		this.targetLm = null;
		this.rawLm = null;
		this.prevFrame = null;
		this.lastPoseAt = 0;
		this.poseTs = 1;
		this.filter.reset();
		this.gait.reset();
		this.miss = 0;
		this.locked = false;
		resetRenderer();
		useLabStore.getState().setFollow(false);
		useLabStore.getState().setOpeningVideo(false);
		useLabStore.getState().setSource({
			mode: "demo",
			sourceLabel: "运动学演示 · 起跑循环",
			error: null
		});
	}
	async startCamera(facing = this.facing) {
		if (!this.video) return false;
		this.stopRecording(false);
		window.clearTimeout(this.detectTimer);
		this.detectTimer = 0;
		this.facing = facing;
		this.follow = false;
		useLabStore.getState().setFollow(false);
		useLabStore.getState().setError(null);
		useLabStore.getState().setOverlay(true);
		this.ensureModel();
		if (!navigator.mediaDevices?.getUserMedia) {
			useLabStore.getState().setError("这台浏览器开不了现场摄像头。允许摄像头权限后再点「打开摄像头」，或用「导入视频」。");
			return false;
		}
		try {
			const stream = await this.openStream(facing);
			this.stopMedia();
			this.stream = stream;
			this.mode = "camera";
			this.prepVideo();
			const video = this.video;
			video.removeAttribute("src");
			video.srcObject = stream;
			video.loop = false;
			await video.play().catch(() => void 0);
			this.displayLm = null;
			this.targetLm = null;
			this.rawLm = null;
			this.lastPoseAt = 0;
			this.poseTs = 1;
			this.filter.reset();
			this.gait.reset();
			this.miss = 0;
			this.locked = false;
			resetRenderer();
			this.bindRvfc();
			this.armDetect();
			useLabStore.getState().setSource({
				mode: "camera",
				sourceLabel: facing === "user" ? "前置摄像头" : "后置摄像头",
				error: null
			});
			useLabStore.getState().setFacing(facing);
			return true;
		} catch (err) {
			const denied = err instanceof Error && /NotAllowed|Permission|denied|Security/i.test(err.name + err.message);
			useLabStore.getState().setError(denied ? "现场摄像头被拦住了。在浏览器里允许摄像头，再点一次「打开摄像头」。这是实时分析，不是录像。" : "现场摄像头没打开。再点一次「打开摄像头」，或改用「导入视频」。");
			return false;
		}
	}
	async openStream(facing) {
		const tries = [
			{
				audio: false,
				video: {
					facingMode: { ideal: facing },
					width: { ideal: 640 },
					height: { ideal: 480 }
				}
			},
			{
				audio: false,
				video: { facingMode: facing }
			},
			{
				audio: false,
				video: true
			}
		];
		let last = /* @__PURE__ */ new Error("camera");
		for (const constraints of tries) try {
			return await navigator.mediaDevices.getUserMedia(constraints);
		} catch (err) {
			last = err;
			const name = err instanceof DOMException ? err.name : err instanceof Error ? err.name : "";
			if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") throw err;
		}
		throw last;
	}
	async switchCamera() {
		const next = this.facing === "user" ? "environment" : "user";
		await this.startCamera(next);
	}
	async loadVideo(file) {
		if (!this.video) return;
		const name = file.name || "video";
		const mime = (file.type || "").toLowerCase();
		if (!(mime.startsWith("video/") || mime === "" || mime === "application/octet-stream" || mime === "video" || VIDEO_EXT.test(name) || file.size > 4096) || file.size < 32) {
			useLabStore.getState().setError("请选择视频文件（相册里的 MP4 / MOV 都可以）。");
			return;
		}
		useLabStore.getState().setOpeningVideo(true);
		useLabStore.getState().setError(null);
		useLabStore.getState().setOverlay(true);
		this.stopRecording(false);
		window.clearTimeout(this.detectTimer);
		this.detectTimer = 0;
		this.cancelRvfc();
		if (this.stream) {
			this.stream.getTracks().forEach((tr) => tr.stop());
			this.stream = null;
		}
		const prevUrl = this.objectUrl;
		const url = URL.createObjectURL(file);
		this.objectUrl = url;
		this.mode = "video";
		this.follow = false;
		this.filter.reset();
		this.gait.reset();
		this.miss = 0;
		this.locked = false;
		this.displayLm = null;
		this.targetLm = null;
		this.rawLm = null;
		this.lastPoseAt = 0;
		this.lastVideoTime = -1;
		this.poseTs = 1;
		this.rvfc = 0;
		resetRenderer();
		const video = this.video;
		this.prepVideo();
		video.loop = true;
		video.playbackRate = 1;
		useLabStore.getState().setPlaybackRate(1);
		useLabStore.getState().setAnalysisFps(0);
		try {
			video.srcObject = null;
		} catch {}
		video.src = url;
		useLabStore.getState().setSource({
			mode: "video",
			sourceLabel: name,
			error: null
		});
		useLabStore.getState().setFollow(false);
		this.ensureModel();
		const playAttempt = video.play();
		try {
			await waitUntilPlayable(video, 2e4);
		} catch {
			if (video.videoWidth > 8 && video.readyState >= 2) {} else {
				useLabStore.getState().setOpeningVideo(false);
				const hevc = /hevc|h\.265|\.mov$/i.test(name) || mime.includes("quicktime");
				useLabStore.getState().setError(hevc ? "这个视频浏览器解不开。请换 MP4（H.264）后再导入。" : "视频打不开。请换 MP4（H.264），或点「打开摄像头」做现场分析。");
				return;
			}
		}
		if (prevUrl && prevUrl !== url) URL.revokeObjectURL(prevUrl);
		try {
			await playAttempt;
		} catch {
			try {
				await video.play();
			} catch {}
		}
		this.bindRvfc();
		this.armDetect();
		this.maybeDetect(performance.now());
		useLabStore.getState().setOpeningVideo(false);
		useLabStore.getState().setVideoMeta({
			duration: Number.isFinite(video.duration) ? video.duration : 0,
			paused: video.paused
		});
	}
	async startRecording() {
		if (this.recorder && this.recorder.state !== "inactive") return;
		await this.startCamera();
		if (!this.stream) return;
		const mime = [
			"video/mp4",
			"video/webm;codecs=vp9",
			"video/webm;codecs=vp8",
			"video/webm"
		].find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
		try {
			const rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : void 0);
			this.recChunks = [];
			rec.ondataavailable = (e) => {
				if (e.data && e.data.size > 0) this.recChunks.push(e.data);
			};
			rec.onstop = () => {
				const blob = new Blob(this.recChunks, { type: rec.mimeType || mime || "video/webm" });
				if (blob.size < 8e3) {
					useLabStore.getState().setError("这段拍摄太短。请再拍一次，跑完一次起跑。");
					useLabStore.getState().setRecording(false);
					return;
				}
				const ext = (rec.mimeType || "").includes("mp4") ? "mp4" : "webm";
				const file = new File([blob], `起跑拍摄.${ext}`, { type: blob.type });
				this.loadVideo(file);
			};
			rec.start(100);
			this.recorder = rec;
			useLabStore.getState().setRecording(true);
			window.clearTimeout(this.recTimer);
			this.recTimer = window.setTimeout(() => this.stopRecording(true), 8e3);
		} catch {
			useLabStore.getState().setError("这台设备不能直接录。请点「打开摄像头」做现场分析，或「导入视频」。");
		}
	}
	stopRecording(save = true) {
		window.clearTimeout(this.recTimer);
		this.recTimer = 0;
		const rec = this.recorder;
		this.recorder = null;
		useLabStore.getState().setRecording(false);
		if (rec && rec.state !== "inactive") {
			if (!save) rec.onstop = null;
			try {
				rec.stop();
			} catch {}
		}
	}
	togglePlay() {
		const video = this.video;
		if (!video || this.mode === "demo") return;
		if (video.paused) video.play().then(() => {
			useLabStore.getState().setPaused(false);
			this.bindRvfc();
		});
		else {
			video.pause();
			useLabStore.getState().setPaused(true);
		}
	}
	seek(t) {
		if (this.video && this.mode === "video") {
			this.video.currentTime = t;
			this.rawLm = null;
			this.lastVideoTime = -1;
		}
	}
	stop() {
		this.stopMedia();
		this.startDemo();
	}
	prepVideo() {
		const video = this.video;
		if (!video) return;
		video.muted = true;
		video.defaultMuted = true;
		video.autoplay = true;
		video.playsInline = true;
		video.setAttribute("playsinline", "true");
		video.setAttribute("webkit-playsinline", "true");
		video.preload = "auto";
		video.controls = false;
		video.disablePictureInPicture = true;
	}
	bindRvfc() {
		this.cancelRvfc();
		const video = this.video;
		if (!video || typeof video.requestVideoFrameCallback !== "function") return;
		if (this.mode === "demo") return;
		const tick = () => {
			if (!this.running || this.mode === "demo") return;
			if (typeof video.requestVideoFrameCallback === "function") this.rvfc = video.requestVideoFrameCallback(tick);
		};
		this.rvfc = video.requestVideoFrameCallback(tick);
	}
	cancelRvfc() {
		const video = this.video;
		if (video && this.rvfc && typeof video.cancelVideoFrameCallback === "function") try {
			video.cancelVideoFrameCallback(this.rvfc);
		} catch {}
		this.rvfc = 0;
	}
	stopMedia() {
		this.cancelRvfc();
		if (this.stream) {
			this.stream.getTracks().forEach((tr) => tr.stop());
			this.stream = null;
		}
		const video = this.video;
		if (video) {
			try {
				video.pause();
			} catch {}
			video.onerror = null;
			if (video.srcObject) video.srcObject = null;
			if (video.getAttribute("src")) video.removeAttribute("src");
		}
		if (this.objectUrl) {
			URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = null;
		}
	}
	async ensureModel() {
		if (this.landmarker || this.modelPromise) return this.modelPromise;
		this.modelPromise = (async () => {
			try {
				const mod = await import("../_libs/mediapipe__tasks-vision.mjs").then((n) => n.t);
				const wasm = `${window.location.origin}/mediapipe/wasm`;
				const model = `${window.location.origin}/mediapipe/pose_landmarker_lite.task`;
				const vision = await mod.FilesetResolver.forVisionTasks(wasm);
				const create = async (delegate) => await mod.PoseLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: model,
						delegate
					},
					runningMode: "VIDEO",
					numPoses: 1,
					minPoseDetectionConfidence: .35,
					minPosePresenceConfidence: .3,
					minTrackingConfidence: .28
				});
				try {
					this.landmarker = await create("GPU");
				} catch {
					this.landmarker = await create("CPU");
				}
				useLabStore.getState().setModelStatus("姿态模型就绪");
			} catch {
				useLabStore.getState().setModelStatus("模型未加载 · 演示仍可运行");
			}
		})();
		return this.modelPromise;
	}
	ensureSize() {
		const canvas = this.canvas;
		const ctx = this.ctx;
		if (!canvas || !ctx) return;
		const parent = this.stage ?? canvas.parentElement;
		const w = Math.max(2, canvas.clientWidth || parent?.clientWidth || 960);
		const h = Math.max(2, canvas.clientHeight || parent?.clientHeight || 540);
		if (canvas.width && Math.abs(w - this.cssW) < 24 && Math.abs(h - this.cssH) < 24) return;
		this.cssW = w;
		this.cssH = h;
		const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	loop = () => {
		if (!this.running) return;
		this.raf = requestAnimationFrame(this.loop);
		const now = performance.now();
		this.ensureSize();
		this.frames += 1;
		if (now - this.fpsWindow >= 1e3) {
			this.fps = this.frames;
			this.frames = 0;
			this.fpsWindow = now;
		}
		if (this.mode === "demo") {
			const t = (now - this.demoStart) / 1e3;
			this.rawLm = sampleSprintPose(t);
			this.lastPoseAt = now;
			this.displayLm = this.rawLm;
		} else this.chase(now);
		const ctx = this.ctx;
		if (!ctx || !this.canvas) return;
		const sample = this.displayLm ? analyzePose(this.displayLm, this.prevFrame, now, this.gait) : null;
		if (this.displayLm) this.prevFrame = {
			landmarks: this.displayLm,
			t: now
		};
		const mills = useLabStore.getState().mills;
		const overlayOn = useLabStore.getState().overlayOn;
		renderFrame({
			ctx,
			w: this.cssW,
			h: this.cssH,
			now,
			video: this.mode === "demo" ? null : this.video,
			mode: this.mode,
			landmarks: overlayOn ? this.displayLm : null,
			follow: false,
			power: sample?.power ?? 0,
			confidence: sample?.confidence ?? 0,
			knee: sample?.knee ?? null,
			torso: sample?.torso ?? null,
			reducedMotion: true,
			score: mills?.overall ?? null,
			grade: mills?.grade ?? null,
			cue: mills?.cue ?? null,
			overlayOn
		});
		this.updateUi(now, sample);
	};
	armDetect() {
		if (this.detectTimer || !this.running || this.mode === "demo") return;
		const gap = Math.max(40, Math.min(90, (this.inferMs || 32) + 12));
		this.detectTimer = window.setTimeout(() => {
			this.detectTimer = 0;
			if (!this.running || this.mode === "demo") return;
			this.maybeDetect(performance.now());
			this.armDetect();
		}, gap);
	}
	updateUi(now, sample) {
		if (now - this.lastUi < 90) return;
		this.lastUi = now;
		const video = this.video;
		const advice = sample ? coachingAdvice(sample) : null;
		let log;
		if (sample && now - this.lastLog > 700) {
			this.lastLog = now;
			log = `${(/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN", { hour12: false })}  膝 ${sample.knee?.toFixed(0) ?? "—"}°  躯干 ${sample.torso?.toFixed(0) ?? "—"}°  ${sample.phase}`;
		}
		useLabStore.getState().applyFrame({
			fps: this.fps,
			latencyMs: this.inferMs,
			sample,
			advice: advice?.text ?? "等待姿态数据。",
			kneeStatus: advice?.knee ?? "—",
			torsoStatus: advice?.torso ?? "—",
			videoTime: video && this.mode === "video" ? video.currentTime : 0,
			videoDuration: video && this.mode === "video" ? video.duration || 0 : 0,
			paused: video ? video.paused : false,
			log
		});
	}
	maybeDetect(now) {
		const video = this.video;
		const landmarker = this.landmarker;
		if (!video || video.readyState < 1 || video.videoWidth < 8) return;
		if (!landmarker) {
			this.ensureModel();
			return;
		}
		if (this.busy) return;
		if (now - this.lastDetectStart < 32) return;
		const vt = video.currentTime;
		if (video.paused && this.rawLm && Math.abs(vt - this.lastVideoTime) < 5e-4) return;
		this.busy = true;
		this.lastDetectStart = now;
		const t0 = performance.now();
		try {
			const ts = this.nextTs(now, vt);
			const frame = this.frameShot(video);
			const pose = landmarker.detectForVideo(frame ?? video, ts).landmarks?.[0];
			if (pose?.length) {
				const lm = toLandmarks(pose);
				if (isTrackedHuman(lm, false)) {
					this.miss = 0;
					this.locked = true;
					this.rawLm = lm;
					this.targetLm = lm;
					this.lastPoseAt = now;
					this.detectFails = 0;
					if (!this.displayLm) this.displayLm = lm.map((p) => ({ ...p }));
				} else {
					this.miss += 1;
					if (this.miss > 10) {
						this.locked = false;
						this.targetLm = null;
						this.displayLm = null;
						this.targetLm = null;
					}
				}
			} else {
				this.miss += 1;
				if (this.miss > 10) {
					this.locked = false;
					this.targetLm = null;
					this.displayLm = null;
					this.targetLm = null;
				}
			}
			this.inferMs = performance.now() - t0;
			this.lastVideoTime = vt;
		} catch {
			this.inferMs = performance.now() - t0;
			this.detectFails += 1;
			if (this.detectFails >= 20) {
				this.landmarker = null;
				this.modelPromise = null;
				this.detectFails = 0;
				this.ensureModel();
			}
		} finally {
			this.busy = false;
		}
	}
	chase(now) {
		const target = this.targetLm;
		if (!target) return;
		if (!this.displayLm || this.displayLm.length !== target.length) {
			this.displayLm = target.map((p) => ({ ...p }));
			this.lastChase = now;
			return;
		}
		const dt = Math.min(.05, Math.max(.001, (now - this.lastChase) / 1e3));
		this.lastChase = now;
		const k = 1 - Math.exp(-dt / .035);
		this.displayLm = this.displayLm.map((p, i) => {
			const q = target[i];
			if ((q.visibility ?? 1) < .08) return p;
			return {
				x: p.x + (q.x - p.x) * k,
				y: p.y + (q.y - p.y) * k,
				z: q.z,
				visibility: q.visibility
			};
		});
	}
	nextTs(now, videoTime) {
		const t = this.mode === "video" ? Math.round(videoTime * 1e3) : Math.round(now);
		if (t <= this.poseTs) this.poseTs += 1;
		else this.poseTs = t;
		return this.poseTs;
	}
	frameShot(video) {
		const vw = video.videoWidth;
		const vh = video.videoHeight;
		if (vw < 8 || vh < 8) return null;
		if (!this.shot) {
			this.shot = document.createElement("canvas");
			this.shotCtx = this.shot.getContext("2d", { alpha: false });
		}
		const ctx = this.shotCtx;
		const c = this.shot;
		if (!ctx || !c) return null;
		const w = 360;
		const h = Math.max(160, Math.round(vh * w / vw));
		if (c.width !== w || c.height !== h) {
			c.width = w;
			c.height = h;
		}
		try {
			ctx.drawImage(video, 0, 0, w, h);
		} catch {
			return null;
		}
		return c;
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 transition-[opacity,background-color,transform,box-shadow] duration-150 ease-out active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground shadow-[var(--shadow-border)] hover:bg-muted",
			outline: "border border-border bg-transparent text-foreground hover:bg-muted",
			ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
			destructive: "bg-destructive/90 text-foreground hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function fmt(n, digits = 1, suffix = "") {
	if (n == null || Number.isNaN(n)) return "—";
	return `${n.toFixed(digits)}${suffix}`;
}
function Meter({ label, value, max, tone = "accent" }) {
	const pct = Math.max(0, Math.min(100, value / max * 100));
	const bar = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums text-accent",
				children: fmt(value, 1)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full", bar),
				style: { width: `${pct}%` }
			})
		})]
	});
}
function LiveMetrics() {
	const sample = useLabStore((s) => s.sample);
	const advice = useLabStore((s) => s.advice);
	const kneeStatus = useLabStore((s) => s.kneeStatus);
	const torsoStatus = useLabStore((s) => s.torsoStatus);
	const logs = useLabStore((s) => s.logs);
	const mills = useLabStore((s) => s.mills);
	const clearLogs = useLabStore((s) => s.clearLogs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end justify-between gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
							children: "Mills 起跑评分"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 font-mono text-4xl font-medium tabular-nums text-foreground",
							children: [mills && mills.overall > 0 ? mills.overall.toFixed(1) : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-sm text-accent",
								children: mills?.grade ?? ""
							})]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-foreground/90",
						children: mills?.cue ?? "把完整起跑拍进画面，按 Set → 离块 → 驱动来打分。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "Set",
								value: mills?.set
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "离块",
								value: mills?.clearance
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "投影",
								value: mills?.projection
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "第一步",
								value: mills?.firstStep
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "前侧",
								value: mills?.frontSide
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreChip, {
								label: "摆臂",
								value: mills?.arms
							})
						]
					}),
					mills?.notes?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground",
						children: mills.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "膝角",
						value: fmt(sample?.knee, 1, "°"),
						hint: kneeStatus,
						ok: kneeStatus === "高效"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "躯干倾角",
						value: fmt(sample?.torso, 1, "°"),
						hint: torsoStatus,
						ok: torsoStatus === "驱动前倾" || torsoStatus === "稳定"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "瞬时速度",
						value: fmt(sample?.speedMs, 2, " m/s"),
						hint: sample?.contacting ? "触地" : "腾空",
						ok: (sample?.speedMs ?? 0) > 3
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "触地",
						value: sample?.contactMs != null ? `${Math.round(sample.contactMs)} ms` : "—",
						hint: "GCT",
						ok: (sample?.contactMs ?? 200) < 160
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "腾空",
						value: sample?.flightMs != null ? `${Math.round(sample.flightMs)} ms` : "—",
						hint: "Flight",
						ok: (sample?.flightMs ?? 0) > 40
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "步频",
						value: fmt(sample?.cadenceSpm, 0, " spm"),
						hint: sample?.strideM != null ? `${sample.strideM.toFixed(2)} m` : "步长",
						ok: (sample?.cadenceSpm ?? 0) > 180
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "即时反馈"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-foreground/90",
					children: advice
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "实时数据流"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-accent hover:text-foreground",
						onClick: clearLogs,
						children: "清除"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-28 overflow-y-auto font-mono text-[11px] leading-5 text-muted-foreground",
					children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "等待姿态数据" }) : logs.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: line }, `${i}-${line}`))
				})]
			})
		]
	});
}
function ScoreChip({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-muted/80 px-1.5 py-2 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-0.5 font-mono text-sm tabular-nums", (value ?? 0) >= 7.2 ? "text-ok" : "text-foreground"),
			children: value ? value.toFixed(1) : "—"
		})]
	});
}
function Stat({ label, value, hint, ok }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-3 py-3 text-center shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-2xl font-medium tabular-nums text-foreground",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]", ok ? "bg-ok/15 text-ok" : "bg-muted text-muted-foreground"),
				children: hint
			})
		]
	});
}
function ScorePanel() {
	const mills = useLabStore((s) => s.mills);
	const sample = useLabStore((s) => s.sample);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
						children: "Glenn Mills · 位置评分"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-6xl font-medium tabular-nums leading-none text-foreground",
							children: mills && mills.overall > 0 ? mills.overall.toFixed(1) : "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pb-1 text-sm text-accent",
							children: mills?.grade ?? "等待入画"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base leading-relaxed text-foreground",
						children: mills?.cue ?? "位置不对，力就使不上。先把完整起跑拍进画面。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-relaxed text-muted-foreground",
						children: "Mills 打的是位置，不是秒表。Set 髋高、离块推地、前十米投影、第一步落在髋下、动作留在身体前方。"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "Set 预备",
						value: mills?.set,
						hint: "髋高，前膝直角"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "离块",
						value: mills?.clearance,
						hint: "推，不是跳"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "投影",
						value: mills?.projection,
						hint: "前十米别站直"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "第一步",
						value: mills?.firstStep,
						hint: "短、狠、髋下"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "前侧机械",
						value: mills?.frontSide,
						hint: "先抬膝再下压"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, {
						label: "摆臂",
						value: mills?.arms,
						hint: "脸颊到髋槽"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: "教练评语"
				}), mills?.notes?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm leading-relaxed text-foreground/90",
					children: mills.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "采集几帧起跑后，这里会出现分项评价。"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					"当前阶段 ",
					phaseLabel(sample?.phase),
					" · 评分随画面里的位置实时更新，不是固定分数。"
				]
			})
		]
	});
}
function ScoreRow({ label, value, hint }) {
	const n = value ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-3 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-lg tabular-nums", n >= 7.4 ? "text-ok" : "text-foreground"),
					children: value ? value.toFixed(1) : "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1 overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent",
					style: { width: `${Math.min(100, n * 10)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
function MechanicsPanel() {
	const history = useLabStore((s) => s.history);
	const sample = useLabStore((s) => s.sample);
	const data = (0, import_react.useMemo)(() => history.map((s, i) => ({
		i,
		knee: s.knee ?? null,
		torso: s.torso ?? null,
		power: s.power,
		speed: s.speedMs ?? null
	})), [history]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-[220px] flex-1 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "关节角与爆发 · 滚动窗口"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[200px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "rgba(255,255,255,0.06)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "i",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [40, 180],
								tick: {
									fill: "#8b939e",
									fontSize: 11
								},
								width: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#141820",
								border: "1px solid #2a313c",
								borderRadius: 8,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "knee",
								name: "膝角",
								stroke: "#8eabc4",
								dot: false,
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "torso",
								name: "躯干",
								stroke: "#7dba9a",
								dot: false,
								strokeWidth: 2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "speed",
								name: "速度",
								stroke: "#d7c9a8",
								dot: false,
								strokeWidth: 2
							})
						]
					})
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "力矩估算 Nm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "踝",
						value: sample?.torqueAnkle ?? 0,
						max: 80
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "膝",
						value: sample?.torqueKnee ?? 0,
						max: 140,
						tone: "warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						label: "髋",
						value: sample?.torqueHip ?? 0,
						max: 160,
						tone: "ok"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "力学指标"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "地面反作用力",
						v: `${fmt(sample?.grf, 0)} N`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "瞬时速度",
						v: `${fmt(sample?.speedMs, 2)} m/s`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "触地时间",
						v: sample?.contactMs != null ? `${Math.round(sample.contactMs)} ms` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "腾空时间",
						v: sample?.flightMs != null ? `${Math.round(sample.flightMs)} ms` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "步长",
						v: fmt(sample?.strideM, 2, " m")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "步频",
						v: fmt(sample?.cadenceSpm, 0, " spm")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "髋角",
						v: fmt(sample?.hip, 1, "°")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "阶段",
						v: phaseLabel(sample?.phase)
					})
				]
			})]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono tabular-nums text-foreground",
			children: v
		})]
	});
}
function phaseLabel(p) {
	switch (p) {
		case "set": return "Set 预备";
		case "drive": return "驱动";
		case "accel": return "加速";
		case "upright": return "途中跑";
		default: return "—";
	}
}
function SystemPanel() {
	const fps = useLabStore((s) => s.fps);
	const latency = useLabStore((s) => s.latencyMs);
	const modelStatus = useLabStore((s) => s.modelStatus);
	const sourceLabel = useLabStore((s) => s.sourceLabel);
	const mode = useLabStore((s) => s.mode);
	const logs = useLabStore((s) => s.logs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "绘制",
					value: `${fps}`,
					hint: "fps",
					ok: fps >= 45
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "推理",
					value: fmt(latency, 1, "ms"),
					hint: "detect",
					ok: latency < 40
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "模型",
					value: modelStatus.includes("就绪") ? "就绪" : "加载",
					hint: modelStatus,
					ok: modelStatus.includes("就绪")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "管道",
					value: mode,
					hint: sourceLabel,
					ok: true
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "系统日志"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-48 overflow-y-auto font-mono text-[11px] leading-5 text-muted-foreground",
				children: logs.length === 0 ? "管道空闲" : logs.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: l }, `${i}-${l}`))
			})]
		})]
	});
}
function SimPanel() {
	const history = useLabStore((s) => s.history);
	const pred = (0, import_react.useMemo)(() => predict100m(history), [history]);
	const data = [
		{
			name: "推荐",
			t: Number(pred.recommended.toFixed(2))
		},
		{
			name: "方案 A",
			t: Number(pred.planA.toFixed(2))
		},
		{
			name: "基线",
			t: Number(pred.baseline.toFixed(2))
		},
		{
			name: "保守",
			t: Number(pred.conservative.toFixed(2))
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card px-4 py-5 text-center shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: "由当前起跑质量推演"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 font-mono text-5xl font-medium tabular-nums text-foreground",
						children: [pred.recommended.toFixed(2), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-lg text-muted-foreground",
							children: "s"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"质量系数 ",
							(pred.quality * 100).toFixed(0),
							"% · 随实时膝角 / 躯干 / 爆发变化"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[180px] rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "rgba(255,255,255,0.06)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: {
									fill: "#8b939e",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [9.4, 12],
								tick: {
									fill: "#8b939e",
									fontSize: 11
								},
								width: 36
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#141820",
								border: "1px solid #2a313c",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "t",
								name: "100m",
								fill: "#8eabc4",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: () => useLabStore.getState().setTab("live"),
				children: "回到实时捕捉继续采集"
			})
		]
	});
}
var TABS = [
	{
		id: "live",
		label: "实时分析"
	},
	{
		id: "score",
		label: "Mills 评分"
	},
	{
		id: "mechanics",
		label: "力学报告"
	},
	{
		id: "system",
		label: "系统监控"
	},
	{
		id: "sim",
		label: "模拟工坊"
	}
];
function LabApp() {
	const videoRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	const tab = useLabStore((s) => s.tab);
	const fps = useLabStore((s) => s.fps);
	const latency = useLabStore((s) => s.latencyMs);
	const sourceLabel = useLabStore((s) => s.sourceLabel);
	const modelStatus = useLabStore((s) => s.modelStatus);
	const error = useLabStore((s) => s.error);
	const mode = useLabStore((s) => s.mode);
	const playbackRate = useLabStore((s) => s.playbackRate);
	const videoTime = useLabStore((s) => s.videoTime);
	const videoDuration = useLabStore((s) => s.videoDuration);
	const paused = useLabStore((s) => s.paused);
	const openingVideo = useLabStore((s) => s.openingVideo);
	const recording = useLabStore((s) => s.recording);
	const sample = useLabStore((s) => s.sample);
	const mills = useLabStore((s) => s.mills);
	const overlayOn = useLabStore((s) => s.overlayOn);
	const analysisFps = useLabStore((s) => s.analysisFps);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		const canvas = canvasRef.current;
		if (!video || !canvas) return;
		const engine = new PoseEngine();
		engineRef.current = engine;
		engine.attach(video, canvas, stageRef.current);
		engine.startDemo();
		return () => {
			engine.destroy();
			engineRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const takeFile = (file) => {
			if (file) engineRef.current?.loadVideo(file);
		};
		const onPaste = (e) => {
			const item = e.clipboardData?.files?.[0];
			if (item) {
				e.preventDefault();
				takeFile(item);
			}
		};
		const onDragOver = (e) => {
			if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
		};
		const onDrop = (e) => {
			if (!e.dataTransfer?.files?.length) return;
			e.preventDefault();
			takeFile(e.dataTransfer.files[0]);
		};
		window.addEventListener("paste", onPaste);
		window.addEventListener("dragover", onDragOver);
		window.addEventListener("drop", onDrop);
		return () => {
			window.removeEventListener("paste", onPaste);
			window.removeEventListener("dragover", onDragOver);
			window.removeEventListener("drop", onDrop);
		};
	}, []);
	const onFile = (file) => {
		if (!file) return;
		engineRef.current?.loadVideo(file);
	};
	const onInput = (e) => {
		const file = e.target.files?.[0];
		onFile(file);
		e.target.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lab-shell flex min-h-dvh flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "lab-header flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium uppercase tracking-[0.22em] text-accent",
						children: "Glenn Mills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-semibold tracking-tight text-foreground sm:text-2xl",
						children: "起跑实验室"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						mills && mills.overall > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
							className: "text-foreground",
							children: [
								"评分 ",
								mills.overall.toFixed(1),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: mills.grade
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-ok" }),
							fps,
							" fps"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
							className: "font-mono tabular-nums",
							children: [latency.toFixed(1), " ms"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: modelStatus })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden px-4 py-2 text-center text-xs text-muted-foreground portrait:block",
				children: "横屏观看：只锁人体 · 骨骼贴关节 · 不跟框"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lab-main grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 md:grid-cols-[minmax(0,1.75fr)_minmax(250px,300px)] md:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-h-0 flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lab-stage relative overflow-hidden rounded-2xl bg-track shadow-[var(--shadow-border)]",
							onDragOver: (e) => {
								e.preventDefault();
								e.dataTransfer.dropEffect = "copy";
							},
							onDrop: (e) => {
								e.preventDefault();
								onFile(e.dataTransfer.files[0]);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: stageRef,
								className: "lab-stage-frame relative min-h-[72vh] w-full md:min-h-[88vh]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										ref: videoRef,
										className: mode === "demo" ? "pointer-events-none absolute inset-0 z-0 h-full w-full object-contain opacity-0" : "pointer-events-none absolute inset-0 z-0 h-full w-full bg-black object-contain",
										playsInline: true,
										muted: true,
										autoPlay: true,
										preload: "auto",
										controls: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
										ref: canvasRef,
										className: "pointer-events-none absolute inset-0 z-[1] h-full w-full"
									}),
									mode === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute inset-0 z-[2]",
										"aria-label": paused ? "播放" : "暂停",
										onClick: () => engineRef.current?.togglePlay()
									}) : null,
									mode === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pointer-events-none absolute inset-x-0 bottom-5 z-[2] mx-auto flex w-fit flex-col items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/85 px-4 py-2 text-sm text-foreground shadow-[var(--shadow-border)]",
											children: "点「导入视频」或把文件拖进画面"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "推荐 MP4 · 相册 / 文件均可"
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pointer-events-none absolute left-3 top-3 z-[3] flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/70 px-3 py-1 text-[11px] font-medium text-foreground",
											children: sourceLabel
										}), sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/70 px-3 py-1 font-mono text-[11px] text-accent",
											children: phaseZh(sample.phase)
										}) : null]
									}),
									openingVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 z-[4] flex items-center justify-center bg-background/50 text-sm",
										children: "正在打开视频…"
									}) : null,
									mode === "video" && paused && !openingVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "absolute bottom-4 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground",
										onClick: () => engineRef.current?.togglePlay(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "播放"]
									}) : null
								]
							})
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "shrink-0 text-xs text-muted-foreground hover:text-foreground",
								onClick: () => useLabStore.getState().setError(null),
								children: "关闭"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
										"导入视频",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileRef,
											type: "file",
											accept: "video/*,.mp4,.mov,.m4v,.webm",
											className: "absolute inset-0 z-10 cursor-pointer opacity-0",
											suppressHydrationWarning: true,
											onChange: onInput
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => void engineRef.current?.startCamera(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "打开摄像头"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: recording ? "destructive" : "secondary",
									onClick: () => recording ? engineRef.current?.stopRecording(true) : void engineRef.current?.startRecording(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), recording ? "结束拍摄" : "拍摄起跑"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => void engineRef.current?.switchCamera(),
									disabled: mode !== "camera",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal2, { className: "size-4" }), "翻转镜头"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => void engineRef.current?.startDemo(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }), "演示起跑"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => engineRef.current?.stop(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "复位"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: overlayOn ? "secondary" : "outline",
									onClick: () => engineRef.current?.setOverlay(!overlayOn),
									children: [overlayOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), overlayOn ? "看原视频" : "骨骼分析"]
								}),
								mode === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => engineRef.current?.setPlaybackRate(playbackRate === 1 ? .5 : 1),
									children: playbackRate === 1 ? "0.5x 慢放" : "1x 常速"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "「导入视频」选相册里的起跑。「打开摄像头」是现场分析，不是录像。人进画面才出骨骼，手、肘、膝、脚都会跟上。"
						}),
						mode === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									onClick: () => engineRef.current?.togglePlay(),
									"aria-label": paused ? "播放" : "暂停",
									children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: Math.max(.1, videoDuration || .1),
									step: .01,
									value: Number.isFinite(videoTime) ? videoTime : 0,
									onChange: (e) => engineRef.current?.seek(Number(e.target.value)),
									className: "h-11 min-w-[120px] flex-1 accent-accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs tabular-nums text-muted-foreground",
									children: [
										formatTime(videoTime),
										" / ",
										formatTime(videoDuration)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: [
										.25,
										.5,
										1
									].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => engineRef.current?.setPlaybackRate(r),
										className: cn("h-9 rounded-md px-2.5 text-xs", playbackRate === r && analysisFps === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"),
										children: [r, "x"]
									}, r))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "分析帧率"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 10,
									step: 1,
									value: analysisFps || 10,
									onChange: (e) => engineRef.current?.setAnalysisFps(Number(e.target.value)),
									className: "h-11 min-w-[140px] flex-1 accent-accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs tabular-nums text-foreground",
									children: [analysisFps || 10, " 帧/秒"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => engineRef.current?.setOverlay(false),
									className: "h-9 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-muted",
									children: "原视频"
								})
							]
						})] }) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex min-h-0 flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto rounded-xl bg-card p-1 shadow-[var(--shadow-border)]",
						children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useLabStore.getState().setTab(t.id),
							className: cn("h-11 shrink-0 rounded-lg px-3 text-sm font-medium", tab === t.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: t.label
						}, t.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-h-0 flex-1",
						children: [
							tab === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveMetrics, {}) : null,
							tab === "score" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScorePanel, {}) : null,
							tab === "mechanics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MechanicsPanel, {}) : null,
							tab === "system" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemPanel, {}) : null,
							tab === "sim" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimPanel, {}) : null
						]
					})]
				})]
			})
		]
	});
}
function Pill({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-8 items-center gap-2 rounded-full bg-card px-3 font-mono text-xs tabular-nums text-muted-foreground shadow-[var(--shadow-border)]", className),
		children
	});
}
function formatTime(t) {
	if (!t || !Number.isFinite(t)) return "0:00";
	return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, "0")}`;
}
function phaseZh(p) {
	switch (p) {
		case "set": return "SET";
		case "drive": return "DRIVE";
		case "accel": return "ACCEL";
		case "upright": return "SPRINT";
		default: return "TRACK";
	}
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabApp, {});
}
//#endregion
export { Home as component };
