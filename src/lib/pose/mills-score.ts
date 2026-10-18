import type { BiomechSample } from "./types";

export type MillsScore = {
  overall: number;
  set: number;
  clearance: number;
  projection: number;
  firstStep: number;
  arms: number;
  frontSide: number;
  grade: string;
  cue: string;
  notes: string[];
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function avg(xs: number[]) {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function scoreBand(value: number, ideal: number, width: number) {
  return clamp(1 - Math.abs(value - ideal) / width, 0, 1) * 10;
}

function gradeOf(n: number) {
  if (n >= 9.2) return "世界级位置";
  if (n >= 8.4) return "精英";
  if (n >= 7.5) return "优秀";
  if (n >= 6.5) return "扎实";
  if (n >= 5.5) return "能用";
  if (n >= 4.5) return "走形";
  return "重做这次";
}

export function scoreMills(history: BiomechSample[]): MillsScore {
  const recent = history.slice(-56);
  const empty: MillsScore = {
    overall: 0,
    set: 0,
    clearance: 0,
    projection: 0,
    firstStep: 0,
    arms: 0,
    frontSide: 0,
    grade: "—",
    cue: "先把人完整拍进画面。位置不对，力就使不上。",
    notes: [],
  };
  if (recent.length < 4) return empty;

  const setFrames = recent.filter((s) => s.phase === "set");
  const driveFrames = recent.filter((s) => s.phase === "drive" || s.phase === "accel");
  const runFrames = recent.filter((s) => s.phase !== "unknown" && s.confidence > 0.28);
  const live = recent.filter((s) => s.confidence > 0.28);
  const body = runFrames.length ? runFrames : live;

  const setKnee = avg(setFrames.map((s) => s.knee ?? 0).filter(Boolean));
  const setTorso = avg(setFrames.map((s) => s.torso ?? 0).filter(Boolean));
  const setScore = setFrames.length
    ? clamp(
        scoreBand(setKnee || 100, 96, 26) * 0.55 + scoreBand(setTorso || 120, 122, 38) * 0.45,
        0,
        10,
      )
    : scoreBand(avg(recent.map((s) => s.knee ?? 120)), 110, 40);

  const driveTorso = avg(driveFrames.map((s) => s.torso ?? 0).filter(Boolean));
  const drivePower = avg(driveFrames.map((s) => s.power));
  const popUp = driveFrames.filter((s) => (s.torso ?? 90) < 32).length / Math.max(1, driveFrames.length);
  const projection = driveFrames.length
    ? clamp(scoreBand(driveTorso || 48, 46, 24) * 0.72 + (1 - popUp) * 3.1, 0, 10)
    : scoreBand(avg(recent.map((s) => s.torso ?? 50)), 50, 30);

  const speeds = body.map((s) => s.comSpeed);
  const meanSp = avg(speeds);
  const reach = speeds.filter((v) => v > meanSp * 1.42).length / Math.max(1, speeds.length);
  const firstStep = clamp(7.1 + ((avg(body.map((s) => s.power)) || drivePower) / 100) * 3.3 - reach * 4.8, 0, 10);

  const clearance = clamp(
    ((drivePower || avg(body.map((s) => s.power))) / 100) * 6.4 +
      scoreBand(avg((driveFrames.length ? driveFrames : body).map((s) => s.knee ?? 140)), 148, 32) * 0.38,
    0,
    10,
  );

  const hipSwing = avg(body.map((s) => Math.abs(s.shoulderHip ?? 0)));
  const arms = clamp(5.4 + Math.min(3.4, hipSwing / 38) + ((drivePower || avg(body.map((s) => s.power))) / 100) * 1.6, 0, 10);

  const kneeFront = avg(body.map((s) => s.knee ?? 130));
  const frontSide = clamp(
    scoreBand(kneeFront, 108, 36) * 0.55 + (1 - reach) * 4.2,
    0,
    10,
  );

  const overall = clamp(
    setScore * 0.16 +
      clearance * 0.16 +
      projection * 0.26 +
      firstStep * 0.18 +
      arms * 0.12 +
      frontSide * 0.12,
    0,
    10,
  );

  const notes: string[] = [];
  let cue = "位置对了，力才会进跑道。把地往身后推。";

  if (setFrames.length && setKnee && setKnee < 84) {
    notes.push("Set：你在坐。Mills 要髋高于肩、肩在手的正上方、前膝接近直角。蹲太深，力推不出去。");
    cue = "Set 把髋抬起来。别坐进起跑器。";
  } else if (setFrames.length && setKnee > 128) {
    notes.push("Set：前腿太直，肌腱没预加载。前膝再屈，像压紧一根弹簧，而不是站在块上。");
    cue = "Set 再屈一点前膝。先把力存进去。";
  } else if (setFrames.length) {
    notes.push("Set 位髋高、前膝有角度。这是能把力打进跑道的位置，不是在比谁蹲得低。");
  }

  if (popUp > 0.26) {
    notes.push("离块后你在站起来。前十米继续投影：眼睛看跑道三到五米处，胸留在髋的前面。站直 = 水平力消失。");
    cue = "别站直。胸留在前面，继续往前推。";
  } else if (driveTorso > 80) {
    notes.push("躯干压得过低，第一步会被自己挡住。髋上提，头不要先抬。推，不是跳。");
    cue = "投影可以，别把第一步压死。推地，不要跳起来。";
  } else if (driveFrames.length) {
    notes.push("驱动阶段还在工作角度。把地往后推，不要去够前面的地面。");
  }

  if (reach > 0.2) {
    notes.push("第一步在够地面。Mills：脚落在髋下，短、狠、向后。步子太大，重心就掉在脚后面。");
    cue = "第一步太大。推地，不要去够地。";
  } else {
    notes.push("步长没有去够，重心在支撑脚上面。地面留在身后，发力方向是对的。");
  }

  if (frontSide < 6.2) {
    notes.push("前侧机械不够：大腿没抬起来，小腿就甩出去了。动作发生在身体前面——先抬膝，再下压，脚背勾起。");
    cue = "先抬膝。正面机械，不要在身后捞地。";
  } else {
    notes.push("前侧位置还在：膝在前面工作。继续把动作留在身体前方，不要在身后捞。");
  }

  if (arms < 6.2) {
    notes.push("摆臂短、碎、横。手臂是杠杆：脸颊到髋槽，前后打，肩放松。左右砍只会把髋带歪。");
  } else {
    notes.push("摆臂有长度，对侧配合能把髋带出去。手走长线，不要在胸前打断。");
  }

  if (overall >= 8.4) {
    cue = "这像一次能用的起跑。保持投影，第三步也不要站直。";
  } else if (overall >= 7.2) {
    cue = "位置大体对。把第一步再收短，力就会更干净。";
  } else if (overall > 0 && notes.length === 0) {
    cue = "把完整的 Set → 离块 → 前三步拍进画面，我按位置打分，不按秒表。";
  }

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
    notes: notes.slice(0, 5),
  };
}
