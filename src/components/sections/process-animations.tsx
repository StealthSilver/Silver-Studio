"use client";

import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";

/** Compact TS that fits the bracket column; lines typed in order. */
const DEV_CODE_LINES = ["type Props = {", "  ok: boolean;", "};"] as const;

function SvgFrame({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn(
        "h-full w-full max-h-[min(26vh,240px)] text-foreground",
        className,
      )}
      role="img"
      aria-label={title}
    >
      {children}
    </svg>
  );
}

/** Radar sweep + pulsing rings — exploratory signal */
export function DiscoveryAnimation() {
  const uid = useId().replace(/:/g, "");
  const scanId = `ps-scan-${uid}`;
  return (
    <SvgFrame title="Discovery animation" className="text-muted-foreground">
      <defs>
        <linearGradient id={scanId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
          <stop offset="82%" stopColor="currentColor" stopOpacity={0.1} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.26} />
        </linearGradient>
      </defs>
      <g className="ps-discovery-scan" style={{ transformOrigin: "100px 100px" }}>
        <path
          d="M 100 100 L 100 22 A 78 78 0 0 1 178 100 Z"
          fill={`url(#${scanId})`}
        />
      </g>
      <circle
        className="ps-discovery-ring-c"
        cx={100}
        cy={100}
        r={78}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.17}
      />
      <circle
        className="ps-discovery-ring-b"
        cx={100}
        cy={100}
        r={56}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.08}
        strokeOpacity={0.2}
      />
      <circle
        className="ps-discovery-ring-a"
        cx={100}
        cy={100}
        r={34}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.15}
        strokeOpacity={0.24}
      />
      <circle
        className="ps-discovery-core"
        cx={100}
        cy={100}
        r={7.5}
        fill="currentColor"
        fillOpacity={0.42}
      />
    </SvgFrame>
  );
}

/** Compass rose with oscillating needle */
export function DirectionAnimation() {
  const uid = useId().replace(/:/g, "");
  const needleGradId = `ps-dir-needle-${uid}`;

  return (
    <SvgFrame title="Direction animation" className="text-muted-foreground">
      <defs>
        <linearGradient
          id={needleGradId}
          x1={100}
          y1={42}
          x2={100}
          y2={118}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.52} />
          <stop offset="55%" stopColor="currentColor" stopOpacity={0.26} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <circle
        cx={100}
        cy={100}
        r={72}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.14}
      />
      <circle
        cx={100}
        cy={100}
        r={46}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.75}
        strokeOpacity={0.07}
      />
      <g
        className="ps-direction-ticks"
        stroke="currentColor"
        strokeWidth={1.35}
        strokeLinecap="round"
      >
        <line x1={100} y1={38} x2={100} y2={49} opacity={0.55} />
        <line x1={162} y1={100} x2={153} y2={100} opacity={0.28} />
        <line x1={100} y1={162} x2={100} y2={153} opacity={0.28} />
        <line x1={38} y1={100} x2={49} y2={100} opacity={0.28} />
      </g>
      <text
        x={100}
        y={56}
        textAnchor="middle"
        fill="currentColor"
        fillOpacity={0.42}
        className="text-[10px] font-medium tracking-[0.22em]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        N
      </text>
      <g className="ps-direction-needle" style={{ transformOrigin: "100px 118px" }}>
        <path d="M 100 44 L 106 118 L 100 110 L 94 118 Z" fill={`url(#${needleGradId})`} />
        <circle cx={100} cy={118} r={6.5} fill="currentColor" fillOpacity={0.2} />
      </g>
    </SvgFrame>
  );
}

/** Bézier stroke drawing + anchor nodes */
export function DesignAnimation() {
  const uid = useId().replace(/:/g, "");
  const pathGradId = `ps-design-path-${uid}`;

  return (
    <SvgFrame title="Design animation" className="text-muted-foreground">
      <defs>
        <linearGradient
          id={pathGradId}
          x1={42}
          y1={100}
          x2={158}
          y2={100}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
          <stop offset="50%" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect
        x={44}
        y={44}
        width={112}
        height={112}
        rx={8}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.11}
        strokeDasharray="8 11"
      />
      <circle
        cx={100}
        cy={100}
        r={38}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.75}
        strokeOpacity={0.06}
      />
      <path
        className="ps-design-path"
        d="M 42 148 C 42 52 158 52 158 148"
        fill="none"
        stroke={`url(#${pathGradId})`}
        strokeWidth={1.45}
        strokeLinecap="round"
        strokeDasharray={420}
        strokeDashoffset={420}
      />
      <circle className="ps-design-node-a" cx={48} cy={156} r={5.5} fill="currentColor" />
      <circle className="ps-design-node-c" cx={100} cy={44} r={5.5} fill="currentColor" />
      <circle className="ps-design-node-b" cx={152} cy={156} r={5.5} fill="currentColor" />
    </SvgFrame>
  );
}

/** Code brackets + line-by-line typing */
export function DevelopmentAnimation() {
  const clipUid = useId().replace(/:/g, "");
  const codeClipId = `ps-dev-code-clip-${clipUid}`;

  const [lines, setLines] = useState<[string, string, string]>(["", "", ""]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setLines([...DEV_CODE_LINES]);
      return;
    }

    let cancelled = false;
    let handle: ReturnType<typeof setTimeout>;

    const CHAR_MS = 44;
    const BETWEEN_LINES_MS = 200;
    const BEFORE_RESTART_MS = 2400;
    const AFTER_CLEAR_MS = 380;

    const run = () => {
      if (cancelled) return;
      setLines(["", "", ""]);
      handle = setTimeout(() => typeLine(0, 0), AFTER_CLEAR_MS);
    };

    const typeLine = (lineIndex: number, col: number) => {
      if (cancelled) return;
      const full = DEV_CODE_LINES[lineIndex];
      if (col < full.length) {
        setLines((prev) => {
          const next: [string, string, string] = [...prev];
          next[lineIndex] = full.slice(0, col + 1);
          return next;
        });
        handle = setTimeout(() => typeLine(lineIndex, col + 1), CHAR_MS);
      } else if (lineIndex < DEV_CODE_LINES.length - 1) {
        handle = setTimeout(() => typeLine(lineIndex + 1, 0), BETWEEN_LINES_MS);
      } else {
        handle = setTimeout(run, BEFORE_RESTART_MS);
      }
    };

    handle = setTimeout(run, 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [reducedMotion]);

  /** Center of bracket inner column (inner stems ~48–152); clip keeps glyphs inside. */
  const codeCenterX = 100;
  const textStyle = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 8.75,
    letterSpacing: "0.02em",
  } as const;

  return (
    <SvgFrame title="Development animation" className="text-muted-foreground">
      <defs>
        <clipPath id={codeClipId}>
          <rect x={50} y={72} width={100} height={56} rx={1} />
        </clipPath>
      </defs>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="ps-dev-bracket-l"
          d="M 76 56 Q 48 56 48 76 V 124 Q 48 144 76 144"
          strokeOpacity={0.46}
        />
        <path
          className="ps-dev-bracket-r"
          d="M 124 56 Q 152 56 152 76 V 124 Q 152 144 124 144"
          strokeOpacity={0.46}
        />
      </g>
      <g clipPath={`url(#${codeClipId})`}>
        <text
          x={codeCenterX}
          y={86}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.44}
          style={textStyle}
        >
          {lines[0]}
        </text>
        <text
          x={codeCenterX}
          y={101}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.44}
          style={textStyle}
        >
          {lines[1]}
        </text>
        <text
          x={codeCenterX}
          y={116}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity={0.44}
          style={textStyle}
        >
          {lines[2]}
        </text>
      </g>
    </SvgFrame>
  );
}

/** Pipeline stages — sequential pulse along a trunk line (deploy / release flow) */
export function DeploymentAnimation() {
  const y = 100;
  const r = 5;
  const xs = [56, 85, 115, 144] as const;

  return (
    <SvgFrame title="Deployment animation" className="text-muted-foreground">
      <circle
        cx={100}
        cy={100}
        r={68}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.75}
        strokeOpacity={0.06}
      />
      <line
        x1={xs[0]}
        y1={y}
        x2={xs[3]}
        y2={y}
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.1}
        strokeLinecap="round"
      />
      <circle
        className="ps-deploy-stage ps-deploy-stage-a"
        cx={xs[0]}
        cy={y}
        r={r}
        fill="currentColor"
      />
      <circle
        className="ps-deploy-stage ps-deploy-stage-b"
        cx={xs[1]}
        cy={y}
        r={r}
        fill="currentColor"
      />
      <circle
        className="ps-deploy-stage ps-deploy-stage-c"
        cx={xs[2]}
        cy={y}
        r={r}
        fill="currentColor"
      />
      <circle
        className="ps-deploy-stage ps-deploy-stage-d"
        cx={xs[3]}
        cy={y}
        r={r}
        fill="currentColor"
      />
    </SvgFrame>
  );
}
