export type Landmark = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

export type SourceMode = "demo" | "camera" | "video";

export type BiomechSample = {
  t: number;
  kneeL: number | null;
  kneeR: number | null;
  knee: number | null;
  torso: number | null;
  hip: number | null;
  ankle: number | null;
  shoulderHip: number | null;
  power: number;
  grf: number;
  comAccel: number;
  comSpeed: number;
  torqueAnkle: number;
  torqueKnee: number;
  torqueHip: number;
  confidence: number;
  phase: "set" | "drive" | "accel" | "upright" | "unknown";
  contactMs: number | null;
  flightMs: number | null;
  strideM: number | null;
  cadenceSpm: number | null;
  speedMs: number | null;
  contacting: boolean;
};

export const POSE_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
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

export const JOINT_INDEX = {
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
  rightFoot: 32,
} as const;

export type ViewBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};
