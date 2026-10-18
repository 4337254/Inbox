import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { predict100m } from "@/lib/pose/biomechanics";
import { useLabStore } from "@/store/lab-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function fmt(n: number | null | undefined, digits = 1, suffix = "") {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}${suffix}`;
}

function Meter({
  label,
  value,
  max,
  tone = "accent",
}: {
  label: string;
  value: number;
  max: number;
  tone?: "accent" | "ok" | "warn";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bar =
    tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : "bg-accent";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono tabular-nums text-accent">{fmt(value, 1)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function LiveMetrics() {
  const sample = useLabStore((s) => s.sample);
  const advice = useLabStore((s) => s.advice);
  const kneeStatus = useLabStore((s) => s.kneeStatus);
  const torsoStatus = useLabStore((s) => s.torsoStatus);
  const logs = useLabStore((s) => s.logs);
  const mills = useLabStore((s) => s.mills);
  const clearLogs = useLabStore((s) => s.clearLogs);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Mills 起跑评分
            </div>
            <div className="mt-1 font-mono text-4xl font-medium tabular-nums text-foreground">
              {mills && mills.overall > 0 ? mills.overall.toFixed(1) : "—"}
              <span className="ml-2 text-sm text-accent">{mills?.grade ?? ""}</span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {mills?.cue ?? "把完整起跑拍进画面，按 Set → 离块 → 驱动来打分。"}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          <ScoreChip label="Set" value={mills?.set} />
          <ScoreChip label="离块" value={mills?.clearance} />
          <ScoreChip label="投影" value={mills?.projection} />
          <ScoreChip label="第一步" value={mills?.firstStep} />
          <ScoreChip label="前侧" value={mills?.frontSide} />
          <ScoreChip label="摆臂" value={mills?.arms} />
        </div>
        {mills?.notes?.length ? (
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
            {mills.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat
          label="膝角"
          value={fmt(sample?.knee, 1, "°")}
          hint={kneeStatus}
          ok={kneeStatus === "高效"}
        />
        <Stat
          label="躯干倾角"
          value={fmt(sample?.torso, 1, "°")}
          hint={torsoStatus}
          ok={torsoStatus === "驱动前倾" || torsoStatus === "稳定"}
        />
        <Stat
          label="瞬时速度"
          value={fmt(sample?.speedMs, 2, " m/s")}
          hint={sample?.contacting ? "触地" : "腾空"}
          ok={(sample?.speedMs ?? 0) > 3}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat
          label="触地"
          value={sample?.contactMs != null ? `${Math.round(sample.contactMs)} ms` : "—"}
          hint="GCT"
          ok={(sample?.contactMs ?? 200) < 160}
        />
        <Stat
          label="腾空"
          value={sample?.flightMs != null ? `${Math.round(sample.flightMs)} ms` : "—"}
          hint="Flight"
          ok={(sample?.flightMs ?? 0) > 40}
        />
        <Stat
          label="步频"
          value={fmt(sample?.cadenceSpm, 0, " spm")}
          hint={sample?.strideM != null ? `${sample.strideM.toFixed(2)} m` : "步长"}
          ok={(sample?.cadenceSpm ?? 0) > 180}
        />
      </div>
      <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          即时反馈
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">{advice}</p>
      </div>
      <div className="min-h-0 flex-1 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            实时数据流
          </span>
          <button
            type="button"
            className="text-xs text-accent hover:text-foreground"
            onClick={clearLogs}
          >
            清除
          </button>
        </div>
        <div className="max-h-28 overflow-y-auto font-mono text-[11px] leading-5 text-muted-foreground">
          {logs.length === 0 ? (
            <div>等待姿态数据</div>
          ) : (
            logs.map((line, i) => <div key={`${i}-${line}`}>{line}</div>)
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreChip({ label, value }: { label: string; value?: number }) {
  const n = value ?? 0;
  const ok = n >= 7.2;
  return (
    <div className="rounded-lg bg-muted/80 px-1.5 py-2 text-center">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-0.5 font-mono text-sm tabular-nums",
          ok ? "text-ok" : "text-foreground",
        )}
      >
        {value ? value.toFixed(1) : "—"}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  ok,
}: {
  label: string;
  value: string;
  hint: string;
  ok: boolean;
}) {
  return (
    <div className="rounded-xl bg-card px-3 py-3 text-center shadow-[var(--shadow-border)]">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-medium tabular-nums text-foreground">{value}</div>
      <div
        className={cn(
          "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px]",
          ok ? "bg-ok/15 text-ok" : "bg-muted text-muted-foreground",
        )}
      >
        {hint}
      </div>
    </div>
  );
}

export function ScorePanel() {
  const mills = useLabStore((s) => s.mills);
  const sample = useLabStore((s) => s.sample);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Glenn Mills · 位置评分
        </div>
        <div className="mt-2 flex items-end gap-3">
          <div className="font-mono text-6xl font-medium tabular-nums leading-none text-foreground">
            {mills && mills.overall > 0 ? mills.overall.toFixed(1) : "—"}
          </div>
          <div className="pb-1 text-sm text-accent">{mills?.grade ?? "等待入画"}</div>
        </div>
        <p className="mt-4 text-base leading-relaxed text-foreground">
          {mills?.cue ?? "位置不对，力就使不上。先把完整起跑拍进画面。"}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Mills 打的是位置，不是秒表。Set 髋高、离块推地、前十米投影、第一步落在髋下、动作留在身体前方。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ScoreRow label="Set 预备" value={mills?.set} hint="髋高，前膝直角" />
        <ScoreRow label="离块" value={mills?.clearance} hint="推，不是跳" />
        <ScoreRow label="投影" value={mills?.projection} hint="前十米别站直" />
        <ScoreRow label="第一步" value={mills?.firstStep} hint="短、狠、髋下" />
        <ScoreRow label="前侧机械" value={mills?.frontSide} hint="先抬膝再下压" />
        <ScoreRow label="摆臂" value={mills?.arms} hint="脸颊到髋槽" />
      </div>
      <div className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          教练评语
        </div>
        {mills?.notes?.length ? (
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
            {mills.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">采集几帧起跑后，这里会出现分项评价。</p>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        当前阶段 {phaseLabel(sample?.phase)} · 评分随画面里的位置实时更新，不是固定分数。
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  value,
  hint,
}: {
  label: string;
  value?: number;
  hint: string;
}) {
  const n = value ?? 0;
  return (
    <div className="rounded-xl bg-card px-3 py-3 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("font-mono text-lg tabular-nums", n >= 7.4 ? "text-ok" : "text-foreground")}>
          {value ? value.toFixed(1) : "—"}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-accent" style={{ width: `${Math.min(100, n * 10)}%` }} />
      </div>
      <div className="mt-1.5 text-[11px] text-muted-foreground">{hint}</div>
    </div>
  );
}

export function MechanicsPanel() {
  const history = useLabStore((s) => s.history);
  const sample = useLabStore((s) => s.sample);
  const data = useMemo(
    () =>
      history.map((s, i) => ({
        i,
        knee: s.knee ?? null,
        torso: s.torso ?? null,
        power: s.power,
        speed: s.speedMs ?? null,
      })),
    [history],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-[220px] flex-1 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          关节角与爆发 · 滚动窗口
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="i" hide />
              <YAxis
                domain={[40, 180]}
                tick={{ fill: "#8b939e", fontSize: 11 }}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "#141820",
                  border: "1px solid #2a313c",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="knee" name="膝角" stroke="#8eabc4" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="torso" name="躯干" stroke="#7dba9a" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="speed" name="速度" stroke="#d7c9a8" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            力矩估算 Nm
          </div>
          <Meter label="踝" value={sample?.torqueAnkle ?? 0} max={80} />
          <Meter label="膝" value={sample?.torqueKnee ?? 0} max={140} tone="warn" />
          <Meter label="髋" value={sample?.torqueHip ?? 0} max={160} tone="ok" />
        </div>
        <div className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            力学指标
          </div>
          <Row k="地面反作用力" v={`${fmt(sample?.grf, 0)} N`} />
          <Row k="瞬时速度" v={`${fmt(sample?.speedMs, 2)} m/s`} />
          <Row k="触地时间" v={sample?.contactMs != null ? `${Math.round(sample.contactMs)} ms` : "—"} />
          <Row k="腾空时间" v={sample?.flightMs != null ? `${Math.round(sample.flightMs)} ms` : "—"} />
          <Row k="步长" v={fmt(sample?.strideM, 2, " m")} />
          <Row k="步频" v={fmt(sample?.cadenceSpm, 0, " spm")} />
          <Row k="髋角" v={fmt(sample?.hip, 1, "°")} />
          <Row k="阶段" v={phaseLabel(sample?.phase)} />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono tabular-nums text-foreground">{v}</span>
    </div>
  );
}

function phaseLabel(p?: string) {
  switch (p) {
    case "set":
      return "Set 预备";
    case "drive":
      return "驱动";
    case "accel":
      return "加速";
    case "upright":
      return "途中跑";
    default:
      return "—";
  }
}

export function NeuralPanel() {
  const sample = useLabStore((s) => s.sample);
  const fps = useLabStore((s) => s.fps);
  const modelStatus = useLabStore((s) => s.modelStatus);
  const pose = (sample?.confidence ?? 0) * 100;
  const action = Math.max(0, pose - 4 + (sample?.power ?? 0) * 0.08);
  const anomaly = Math.max(0.2, 8 - pose * 0.07);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="姿态置信" value={`${fmt(pose, 1)}%`} hint={modelStatus} ok={pose > 70} />
        <Stat label="动作分类" value={`${fmt(action, 1)}%`} hint="时序融合" ok={action > 65} />
        <Stat label="异常度" value={`${fmt(anomaly, 1)}%`} hint="残差" ok={anomaly < 5} />
      </div>
      <div className="space-y-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          实时推理
        </div>
        <Meter label="姿态检测" value={pose} max={100} />
        <Meter label="动作分类" value={action} max={100} tone="ok" />
        <Meter label="异常残差" value={anomaly} max={20} tone="warn" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          置信度来自当前骨骼可见性，不是写死的 98%。无人体入画时数值会下降。推理帧率 {fps} fps。
        </p>
      </div>
    </div>
  );
}

export function SystemPanel() {
  const fps = useLabStore((s) => s.fps);
  const latency = useLabStore((s) => s.latencyMs);
  const modelStatus = useLabStore((s) => s.modelStatus);
  const sourceLabel = useLabStore((s) => s.sourceLabel);
  const mode = useLabStore((s) => s.mode);
  const logs = useLabStore((s) => s.logs);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="绘制" value={`${fps}`} hint="fps" ok={fps >= 45} />
        <Stat label="推理" value={fmt(latency, 1, "ms")} hint="detect" ok={latency < 40} />
        <Stat label="模型" value={modelStatus.includes("就绪") ? "就绪" : "加载"} hint={modelStatus} ok={modelStatus.includes("就绪")} />
        <Stat label="管道" value={mode} hint={sourceLabel} ok />
      </div>
      <div className="min-h-0 flex-1 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          系统日志
        </div>
        <div className="max-h-48 overflow-y-auto font-mono text-[11px] leading-5 text-muted-foreground">
          {logs.length === 0 ? "管道空闲" : logs.map((l, i) => <div key={`${i}-${l}`}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

export function SimPanel() {
  const history = useLabStore((s) => s.history);
  const pred = useMemo(() => predict100m(history), [history]);
  const data = [
    { name: "推荐", t: Number(pred.recommended.toFixed(2)) },
    { name: "方案 A", t: Number(pred.planA.toFixed(2)) },
    { name: "基线", t: Number(pred.baseline.toFixed(2)) },
    { name: "保守", t: Number(pred.conservative.toFixed(2)) },
  ];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-xl bg-card px-4 py-5 text-center shadow-[var(--shadow-border)]">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">由当前起跑质量推演</div>
        <div className="mt-2 font-mono text-5xl font-medium tabular-nums text-foreground">
          {pred.recommended.toFixed(2)}
          <span className="ml-1 text-lg text-muted-foreground">s</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          质量系数 {(pred.quality * 100).toFixed(0)}% · 随实时膝角 / 躯干 / 爆发变化
        </div>
      </div>
      <div className="h-[180px] rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#8b939e", fontSize: 11 }} />
            <YAxis domain={[9.4, 12]} tick={{ fill: "#8b939e", fontSize: 11 }} width={36} />
            <Tooltip
              contentStyle={{
                background: "#141820",
                border: "1px solid #2a313c",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="t" name="100m" fill="#8eabc4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => useLabStore.getState().setTab("live")}
      >
        回到实时捕捉继续采集
      </Button>
    </div>
  );
}
