import { sampleSprintPose } from "./demo-athlete";
import { analyzePose, coachingAdvice, GaitTracker, isTrackedHuman, LandmarkFilter } from "./biomechanics";
import { renderFrame, resetRenderer } from "./render";
import type { Landmark, SourceMode } from "./types";
import { useLabStore } from "@/store/lab-store";

type Landmarker = {
  detectForVideo: (
    image: HTMLVideoElement | HTMLCanvasElement,
    timestamp: number,
  ) => { landmarks: Array<Array<{ x: number; y: number; z?: number; visibility?: number }>> };
  close: () => void;
};

type VideoEl = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number) => void) => number;
  cancelVideoFrameCallback?: (id: number) => void;
};

const VIDEO_EXT = /\.(mp4|m4v|mov|qt|webm|mkv|avi|3gp|mpeg|mpg|hevc)$/i;

function toLandmarks(
  raw: Array<{ x: number; y: number; z?: number; visibility?: number }>,
): Landmark[] {
  return raw.map((p) => ({
    x: p.x,
    y: p.y,
    z: p.z ?? 0,
    visibility: p.visibility ?? 1,
  }));
}

function waitUntilPlayable(video: HTMLVideoElement, ms: number) {
  return new Promise<void>((resolve, reject) => {
    let done = false;
    const finish = (ok: boolean, reason?: string) => {
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

export class PoseEngine {
  video: HTMLVideoElement | null = null;
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  private landmarker: Landmarker | null = null;
  private raf = 0;
  private rvfc = 0;
  private running = false;
  private busy = false;
  private mode: SourceMode = "demo";
  private stream: MediaStream | null = null;
  private objectUrl: string | null = null;
  private facing: "user" | "environment" = "environment";
  private follow = false;
  private lastPoseAt = 0;
  private displayLm: Landmark[] | null = null;
  private targetLm: Landmark[] | null = null;
  private lastChase = 0;
  private rawLm: Landmark[] | null = null;
  private prevFrame: { landmarks: Landmark[]; t: number } | null = null;
  private filter = new LandmarkFilter();
  private lastUi = 0;
  private lastLog = 0;
  private frames = 0;
  private fpsWindow = 0;
  private fps = 0;
  private inferMs = 0;
  private demoStart = 0;
  private cssW = 0;
  private cssH = 0;
  private reduced = false;
  private modelPromise: Promise<void> | null = null;
  private lastVideoTime = -1;
  private lastDetectStart = 0;
  private detectFails = 0;
  private poseTs = 1;
  private miss = 0;
  private locked = false;
  private gait = new GaitTracker();
  private drawN = 0;
  private shot: HTMLCanvasElement | null = null;
  private shotCtx: CanvasRenderingContext2D | null = null;
  private recorder: MediaRecorder | null = null;
  private recChunks: Blob[] = [];
  private recTimer = 0;
  private detectTimer = 0;
  private stage: HTMLElement | null = null;

  attach(video: HTMLVideoElement, canvas: HTMLCanvasElement, stage?: HTMLElement | null) {
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
    const later =
      typeof window.requestIdleCallback === "function"
        ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 1800 })
        : (cb: () => void) => window.setTimeout(cb, 400);
    later(() => {
      if (this.running) void this.ensureModel();
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
    } catch {
      /* ignore */
    }
    this.landmarker = null;
    resetRenderer();
  }

  setFollow(on: boolean) {
    this.follow = on;
    useLabStore.getState().setFollow(on);
  }

  setPlaybackRate(rate: number) {
    if (this.video) this.video.playbackRate = rate;
    useLabStore.getState().setPlaybackRate(rate);
    useLabStore.getState().setAnalysisFps(0);
  }

  setAnalysisFps(fps: number) {
    const n = Math.max(1, Math.min(10, Math.round(fps)));
    if (this.video) this.video.playbackRate = n / 30;
    useLabStore.getState().setAnalysisFps(n);
    useLabStore.getState().setPlaybackRate(n / 30);
  }

  setOverlay(on: boolean) {
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
      error: null,
    });
  }

  async startCamera(facing: "user" | "environment" = this.facing): Promise<boolean> {
    if (!this.video) return false;
    this.stopRecording(false);
    window.clearTimeout(this.detectTimer);
    this.detectTimer = 0;
    this.facing = facing;
    this.follow = false;
    useLabStore.getState().setFollow(false);
    useLabStore.getState().setError(null);
    useLabStore.getState().setOverlay(true);
    void this.ensureModel();
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
      await video.play().catch(() => undefined);
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
        error: null,
      });
      useLabStore.getState().setFacing(facing);
      return true;
    } catch (err) {
      const denied =
        err instanceof Error && /NotAllowed|Permission|denied|Security/i.test(err.name + err.message);
      useLabStore.getState().setError(
        denied
          ? "现场摄像头被拦住了。在浏览器里允许摄像头，再点一次「打开摄像头」。这是实时分析，不是录像。"
          : "现场摄像头没打开。再点一次「打开摄像头」，或改用「导入视频」。",
      );
      return false;
    }
  }

  private async openStream(facing: "user" | "environment") {
    const tries: MediaStreamConstraints[] = [
      {
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      },
      { audio: false, video: { facingMode: facing } },
      { audio: false, video: true },
    ];
    let last: unknown = new Error("camera");
    for (const constraints of tries) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        last = err;
        const name = err instanceof DOMException ? err.name : err instanceof Error ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError" || name === "PermissionDeniedError") {
          throw err;
        }
      }
    }
    throw last;
  }

  async switchCamera() {
    const next = this.facing === "user" ? "environment" : "user";
    await this.startCamera(next);
  }

  async loadVideo(file: File) {
    if (!this.video) return;
    const name = file.name || "video";
    const mime = (file.type || "").toLowerCase();
    const looksVideo =
      mime.startsWith("video/") ||
      mime === "" ||
      mime === "application/octet-stream" ||
      mime === "video" ||
      VIDEO_EXT.test(name) ||
      file.size > 4096;
    if (!looksVideo || file.size < 32) {
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
    } catch {
      /* ignore */
    }
    video.src = url;

    useLabStore.getState().setSource({
      mode: "video",
      sourceLabel: name,
      error: null,
    });
    useLabStore.getState().setFollow(false);
    void this.ensureModel();

    const playAttempt = video.play();

    try {
      await waitUntilPlayable(video, 20000);
    } catch {
      if (video.videoWidth > 8 && video.readyState >= 2) {
        /* already decoded */
      } else {
        useLabStore.getState().setOpeningVideo(false);
        const hevc = /hevc|h\.265|\.mov$/i.test(name) || mime.includes("quicktime");
        useLabStore.getState().setError(
          hevc
            ? "这个视频浏览器解不开。请换 MP4（H.264）后再导入。"
            : "视频打不开。请换 MP4（H.264），或点「打开摄像头」做现场分析。",
        );
        return;
      }
    }
    if (prevUrl && prevUrl !== url) URL.revokeObjectURL(prevUrl);

    try {
      await playAttempt;
    } catch {
      try {
        await video.play();
      } catch {
        /* paused overlay asks for a tap */
      }
    }
    this.bindRvfc();
    this.armDetect();
    this.maybeDetect(performance.now());
    useLabStore.getState().setOpeningVideo(false);
    useLabStore.getState().setVideoMeta({
      duration: Number.isFinite(video.duration) ? video.duration : 0,
      paused: video.paused,
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
      "video/webm",
    ].find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t));
    try {
      const rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined);
      this.recChunks = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) this.recChunks.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(this.recChunks, { type: rec.mimeType || mime || "video/webm" });
        if (blob.size < 8000) {
          useLabStore.getState().setError("这段拍摄太短。请再拍一次，跑完一次起跑。");
          useLabStore.getState().setRecording(false);
          return;
        }
        const ext = (rec.mimeType || "").includes("mp4") ? "mp4" : "webm";
        const file = new File([blob], `起跑拍摄.${ext}`, { type: blob.type });
        void this.loadVideo(file);
      };
      rec.start(100);
      this.recorder = rec;
      useLabStore.getState().setRecording(true);
      window.clearTimeout(this.recTimer);
      this.recTimer = window.setTimeout(() => this.stopRecording(true), 8000);
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
      } catch {
        /* ignore */
      }
    }
  }

  togglePlay() {
    const video = this.video;
    if (!video || this.mode === "demo") return;
    if (video.paused) {
      void video.play().then(() => {
        useLabStore.getState().setPaused(false);
        this.bindRvfc();
      });
    } else {
      video.pause();
      useLabStore.getState().setPaused(true);
    }
  }

  seek(t: number) {
    if (this.video && this.mode === "video") {
      this.video.currentTime = t;
      this.rawLm = null;
      this.lastVideoTime = -1;
    }
  }

  stop() {
    this.stopMedia();
    void this.startDemo();
  }

  private prepVideo() {
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

  private bindRvfc() {
    this.cancelRvfc();
    const video = this.video as VideoEl | null;
    if (!video || typeof video.requestVideoFrameCallback !== "function") return;
    if (this.mode === "demo") return;
    const tick = () => {
      if (!this.running || this.mode === "demo") return;
      if (typeof video.requestVideoFrameCallback === "function") {
        this.rvfc = video.requestVideoFrameCallback(tick);
      }
    };
    this.rvfc = video.requestVideoFrameCallback(tick);
  }

  private cancelRvfc() {
    const video = this.video as VideoEl | null;
    if (video && this.rvfc && typeof video.cancelVideoFrameCallback === "function") {
      try {
        video.cancelVideoFrameCallback(this.rvfc);
      } catch {
        /* ignore */
      }
    }
    this.rvfc = 0;
  }

  private stopMedia() {
    this.cancelRvfc();
    if (this.stream) {
      this.stream.getTracks().forEach((tr) => tr.stop());
      this.stream = null;
    }
    const video = this.video;
    if (video) {
      try {
        video.pause();
      } catch {
        /* ignore */
      }
      video.onerror = null;
      if (video.srcObject) {
        video.srcObject = null;
      }
      if (video.getAttribute("src")) {
        video.removeAttribute("src");
      }
    }
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private async ensureModel() {
    if (this.landmarker || this.modelPromise) return this.modelPromise;
    this.modelPromise = (async () => {
      try {
        const mod = await import("@mediapipe/tasks-vision");
        const wasm = `${window.location.origin}/mediapipe/wasm`;
        const model = `${window.location.origin}/mediapipe/pose_landmarker_lite.task`;
        const vision = await mod.FilesetResolver.forVisionTasks(wasm);
        const create = async (delegate: "GPU" | "CPU") =>
          (await mod.PoseLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: model, delegate },
            runningMode: "VIDEO",
            numPoses: 1,
            minPoseDetectionConfidence: 0.35,
            minPosePresenceConfidence: 0.3,
            minTrackingConfidence: 0.28,
          })) as unknown as Landmarker;
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

  private ensureSize() {
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

  private loop = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    this.ensureSize();
    this.frames += 1;
    if (now - this.fpsWindow >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.fpsWindow = now;
    }

    if (this.mode === "demo") {
      const t = (now - this.demoStart) / 1000;
      this.rawLm = sampleSprintPose(t);
      this.lastPoseAt = now;
      this.displayLm = this.rawLm;
    } else {
      this.chase(now);
    }

    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;
    const sample = this.displayLm
      ? analyzePose(this.displayLm, this.prevFrame, now, this.gait)
      : null;
    if (this.displayLm) {
      this.prevFrame = { landmarks: this.displayLm, t: now };
    }

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
      overlayOn,
    });
    this.updateUi(now, sample);
  };

  private armDetect() {
    if (this.detectTimer || !this.running || this.mode === "demo") return;
    const gap = Math.max(40, Math.min(90, (this.inferMs || 32) + 12));
    this.detectTimer = window.setTimeout(() => {
      this.detectTimer = 0;
      if (!this.running || this.mode === "demo") return;
      this.maybeDetect(performance.now());
      this.armDetect();
    }, gap);
  }

  private updateUi(now: number, sample: ReturnType<typeof analyzePose> | null) {
    if (now - this.lastUi < 90) return;
    this.lastUi = now;
    const video = this.video;
    const advice = sample ? coachingAdvice(sample) : null;
    let log: string | undefined;
    if (sample && now - this.lastLog > 700) {
      this.lastLog = now;
      const clock = new Date().toLocaleTimeString("zh-CN", { hour12: false });
      log = `${clock}  膝 ${sample.knee?.toFixed(0) ?? "—"}°  躯干 ${sample.torso?.toFixed(0) ?? "—"}°  ${sample.phase}`;
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
      log,
    });
  }

  private maybeDetect(now: number) {
    const video = this.video;
    const landmarker = this.landmarker;
    if (!video || video.readyState < 1 || video.videoWidth < 8) return;
    if (!landmarker) {
      void this.ensureModel();
      return;
    }
    if (this.busy) return;
    if (now - this.lastDetectStart < 32) return;
    const vt = video.currentTime;
    if (video.paused && this.rawLm && Math.abs(vt - this.lastVideoTime) < 0.0005) return;
    this.busy = true;
    this.lastDetectStart = now;
    const t0 = performance.now();
    try {
      const ts = this.nextTs(now, vt);
      const frame = this.frameShot(video);
      const result = landmarker.detectForVideo(frame ?? video, ts);
      const pose = result.landmarks?.[0];
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
        void this.ensureModel();
      }
    } finally {
      this.busy = false;
    }
  }

  private chase(now: number) {
    const target = this.targetLm;
    if (!target) return;
    if (!this.displayLm || this.displayLm.length !== target.length) {
      this.displayLm = target.map((p) => ({ ...p }));
      this.lastChase = now;
      return;
    }
    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastChase) / 1000));
    this.lastChase = now;
    const k = 1 - Math.exp(-dt / 0.035);
    this.displayLm = this.displayLm.map((p, i) => {
      const q = target[i];
      if ((q.visibility ?? 1) < 0.08) return p;
      return {
        x: p.x + (q.x - p.x) * k,
        y: p.y + (q.y - p.y) * k,
        z: q.z,
        visibility: q.visibility,
      };
    });
  }

  private nextTs(now: number, videoTime: number) {
    const t = this.mode === "video" ? Math.round(videoTime * 1000) : Math.round(now);
    if (t <= this.poseTs) this.poseTs += 1;
    else this.poseTs = t;
    return this.poseTs;
  }

  private frameShot(video: HTMLVideoElement) {
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
    const h = Math.max(160, Math.round((vh * w) / vw));
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
}
