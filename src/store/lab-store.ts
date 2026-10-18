import { create } from "zustand";
import type { BiomechSample, SourceMode } from "@/lib/pose/types";
import { scoreMills, type MillsScore } from "@/lib/pose/mills-score";

export type TabId = "live" | "score" | "mechanics" | "system" | "sim";

type LabState = {
  tab: TabId;
  mode: SourceMode;
  facing: "user" | "environment";
  fps: number;
  latencyMs: number;
  modelStatus: string;
  sourceLabel: string;
  error: string | null;
  followAthlete: boolean;
  overlayOn: boolean;
  analysisFps: number;
  playbackRate: number;
  videoDuration: number;
  videoTime: number;
  paused: boolean;
  openingVideo: boolean;
  recording: boolean;
  sample: BiomechSample | null;
  history: BiomechSample[];
  logs: string[];
  advice: string;
  kneeStatus: string;
  torsoStatus: string;
  mills: MillsScore | null;
  setTab: (tab: TabId) => void;
  setFollow: (on: boolean) => void;
  setOverlay: (on: boolean) => void;
  setAnalysisFps: (fps: number) => void;
  setPlaybackRate: (rate: number) => void;
  setFacing: (facing: "user" | "environment") => void;
  setError: (error: string | null) => void;
  setModelStatus: (modelStatus: string) => void;
  setPaused: (paused: boolean) => void;
  setOpeningVideo: (openingVideo: boolean) => void;
  setRecording: (recording: boolean) => void;
  setVideoMeta: (meta: { duration: number; paused: boolean }) => void;
  setSource: (p: { mode: SourceMode; sourceLabel: string; error: string | null }) => void;
  applyFrame: (p: {
    fps: number;
    latencyMs: number;
    sample: BiomechSample | null;
    advice: string;
    kneeStatus: string;
    torsoStatus: string;
    videoTime: number;
    videoDuration: number;
    paused: boolean;
    log?: string;
  }) => void;
  clearLogs: () => void;
};

export const useLabStore = create<LabState>((set) => ({
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
  setVideoMeta: (meta) => set({ videoDuration: meta.duration, paused: meta.paused }),
  setSource: ({ mode, sourceLabel, error }) =>
    set({ mode, sourceLabel, error, history: [], sample: null, mills: null }),
  applyFrame: (p) =>
    set((s) => {
      const history = p.sample
        ? s.history.length >= 96
          ? [...s.history.slice(-95), p.sample]
          : [...s.history, p.sample]
        : s.history;
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
        mills: scoreMills(history),
      };
    }),
  clearLogs: () => set({ logs: [] }),
}));
