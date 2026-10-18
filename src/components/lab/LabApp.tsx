import { useEffect, useRef, type ChangeEvent, type ReactNode } from "react";
import {
  Camera,
  FlipHorizontal2,
  Pause,
  Play,
  RotateCcw,
  Upload,
  UserRound,
  Video,
  Eye,
  EyeOff,
} from "lucide-react";
import { PoseEngine } from "@/lib/pose/engine";
import { useLabStore, type TabId } from "@/store/lab-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LiveMetrics,
  MechanicsPanel,
  ScorePanel,
  SimPanel,
  SystemPanel,
} from "./Panels";

const TABS: { id: TabId; label: string }[] = [
  { id: "live", label: "实时分析" },
  { id: "score", label: "Mills 评分" },
  { id: "mechanics", label: "力学报告" },
  { id: "system", label: "系统监控" },
  { id: "sim", label: "模拟工坊" },
];

const ACCEPT = "video/*,.mp4,.mov,.m4v,.webm";

export function LabApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<PoseEngine | null>(null);

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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const engine = new PoseEngine();
    engineRef.current = engine;
    engine.attach(video, canvas, stageRef.current);
    void engine.startDemo();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const takeFile = (file: File | undefined) => {
      if (file) void engineRef.current?.loadVideo(file);
    };
    const onPaste = (e: ClipboardEvent) => {
      const item = e.clipboardData?.files?.[0];
      if (item) {
        e.preventDefault();
        takeFile(item);
      }
    };
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
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

  const onFile = (file: File | undefined) => {
    if (!file) return;
    void engineRef.current?.loadVideo(file);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onFile(file);
    e.target.value = "";
  };

  return (
    <div className="lab-shell flex min-h-dvh flex-col bg-background">
      <header className="lab-header flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
            Glenn Mills
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            起跑实验室
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mills && mills.overall > 0 ? (
            <Pill className="text-foreground">
              评分 {mills.overall.toFixed(1)}
              <span className="text-accent">{mills.grade}</span>
            </Pill>
          ) : null}
          <Pill>
            <span className="size-1.5 rounded-full bg-ok" />
            {fps} fps
          </Pill>
          <Pill className="font-mono tabular-nums">{latency.toFixed(1)} ms</Pill>
          <Pill>{modelStatus}</Pill>
        </div>
      </header>

      <div className="hidden px-4 py-2 text-center text-xs text-muted-foreground portrait:block">
        横屏观看：只锁人体 · 骨骼贴关节 · 不跟框
      </div>

      <div className="lab-main grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 md:grid-cols-[minmax(0,1.75fr)_minmax(250px,300px)] md:p-4">
        <section className="flex min-h-0 flex-col gap-3">
          <div
            className="lab-stage relative overflow-hidden rounded-2xl bg-track shadow-[var(--shadow-border)]"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(e) => {
              e.preventDefault();
              onFile(e.dataTransfer.files[0]);
            }}
          >
            <div
              ref={stageRef}
              className="lab-stage-frame relative min-h-[72vh] w-full md:min-h-[88vh]"
            >
              <video
                ref={videoRef}
                className={
                  mode === "demo"
                    ? "pointer-events-none absolute inset-0 z-0 h-full w-full object-contain opacity-0"
                    : "pointer-events-none absolute inset-0 z-0 h-full w-full bg-black object-contain"
                }
                playsInline
                muted
                autoPlay
                preload="auto"
                controls={false}
              />
              <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
              />
              {mode === "video" ? (
                <button
                  type="button"
                  className="absolute inset-0 z-[2]"
                  aria-label={paused ? "播放" : "暂停"}
                  onClick={() => engineRef.current?.togglePlay()}
                />
              ) : null}
              {mode === "demo" ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[2] mx-auto flex w-fit flex-col items-center gap-1">
                  <span className="rounded-full bg-background/85 px-4 py-2 text-sm text-foreground shadow-[var(--shadow-border)]">
                    点「导入视频」或把文件拖进画面
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    推荐 MP4 · 相册 / 文件均可
                  </span>
                </div>
              ) : null}
              <div className="pointer-events-none absolute left-3 top-3 z-[3] flex gap-2">
                <span className="rounded-full bg-background/70 px-3 py-1 text-[11px] font-medium text-foreground">
                  {sourceLabel}
                </span>
                {sample ? (
                  <span className="rounded-full bg-background/70 px-3 py-1 font-mono text-[11px] text-accent">
                    {phaseZh(sample.phase)}
                  </span>
                ) : null}
              </div>
              {openingVideo ? (
                <div className="absolute inset-0 z-[4] flex items-center justify-center bg-background/50 text-sm">
                  正在打开视频…
                </div>
              ) : null}
              {mode === "video" && paused && !openingVideo ? (
                <button
                  type="button"
                  className="absolute bottom-4 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                  onClick={() => engineRef.current?.togglePlay()}
                >
                  <Play className="size-4" />
                  播放
                </button>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
              <span>{error}</span>
              <button
                type="button"
                className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => useLabStore.getState().setError(null)}
              >
                关闭
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              <Upload className="size-4" />
              导入视频
              <input
                ref={fileRef}
                type="file"
                accept="video/*,.mp4,.mov,.m4v,.webm"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                suppressHydrationWarning
                onChange={onInput}
              />
            </label>
            <Button onClick={() => void engineRef.current?.startCamera()}>
              <Camera className="size-4" />
              打开摄像头
            </Button>
            <Button
              variant={recording ? "destructive" : "secondary"}
              onClick={() =>
                recording
                  ? engineRef.current?.stopRecording(true)
                  : void engineRef.current?.startRecording()
              }
            >
              <Video className="size-4" />
              {recording ? "结束拍摄" : "拍摄起跑"}
            </Button>
            <Button
              variant="outline"
              onClick={() => void engineRef.current?.switchCamera()}
              disabled={mode !== "camera"}
            >
              <FlipHorizontal2 className="size-4" />
              翻转镜头
            </Button>
            <Button variant="outline" onClick={() => void engineRef.current?.startDemo()}>
              <UserRound className="size-4" />
              演示起跑
            </Button>
            <Button variant="ghost" onClick={() => engineRef.current?.stop()}>
              <RotateCcw className="size-4" />
              复位
            </Button>
            <Button
              variant={overlayOn ? "secondary" : "outline"}
              onClick={() => engineRef.current?.setOverlay(!overlayOn)}
            >
              {overlayOn ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {overlayOn ? "看原视频" : "骨骼分析"}
            </Button>
            {mode === "video" ? (
              <Button
                variant="outline"
                onClick={() => engineRef.current?.setPlaybackRate(playbackRate === 1 ? 0.5 : 1)}
              >
                {playbackRate === 1 ? "0.5x 慢放" : "1x 常速"}
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            「导入视频」选相册里的起跑。「打开摄像头」是现场分析，不是录像。人进画面才出骨骼，手、肘、膝、脚都会跟上。
          </p>

          {mode === "video" ? (
            <>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => engineRef.current?.togglePlay()}
                aria-label={paused ? "播放" : "暂停"}
              >
                {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              </Button>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, videoDuration || 0.1)}
                step={0.01}
                value={Number.isFinite(videoTime) ? videoTime : 0}
                onChange={(e) => engineRef.current?.seek(Number(e.target.value))}
                className="h-11 min-w-[120px] flex-1 accent-accent"
              />
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatTime(videoTime)} / {formatTime(videoDuration)}
              </span>
              <div className="flex gap-1">
                {[0.25, 0.5, 1].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => engineRef.current?.setPlaybackRate(r)}
                    className={cn(
                      "h-9 rounded-md px-2.5 text-xs",
                      playbackRate === r && analysisFps === 0
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {r}x
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-border)]">
              <span className="text-xs text-muted-foreground">分析帧率</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={analysisFps || 10}
                onChange={(e) => engineRef.current?.setAnalysisFps(Number(e.target.value))}
                className="h-11 min-w-[140px] flex-1 accent-accent"
              />
              <span className="font-mono text-xs tabular-nums text-foreground">
                {analysisFps || 10} 帧/秒
              </span>
              <button
                type="button"
                onClick={() => engineRef.current?.setOverlay(false)}
                className="h-9 rounded-md px-2.5 text-xs text-muted-foreground hover:bg-muted"
              >
                原视频
              </button>
            </div>
            </>
          ) : null}
        </section>

        <aside className="flex min-h-0 flex-col gap-3">
          <nav className="flex gap-1 overflow-x-auto rounded-xl bg-card p-1 shadow-[var(--shadow-border)]">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => useLabStore.getState().setTab(t.id)}
                className={cn(
                  "h-11 shrink-0 rounded-lg px-3 text-sm font-medium",
                  tab === t.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1">
            {tab === "live" ? <LiveMetrics /> : null}
            {tab === "score" ? <ScorePanel /> : null}
            {tab === "mechanics" ? <MechanicsPanel /> : null}
            {tab === "system" ? <SystemPanel /> : null}
            {tab === "sim" ? <SimPanel /> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full bg-card px-3 font-mono text-xs tabular-nums text-muted-foreground shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function formatTime(t: number) {
  if (!t || !Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function phaseZh(p: string) {
  switch (p) {
    case "set":
      return "SET";
    case "drive":
      return "DRIVE";
    case "accel":
      return "ACCEL";
    case "upright":
      return "SPRINT";
    default:
      return "TRACK";
  }
}
