"use client";

import { useId } from "react";

function SvgFrame({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full max-h-[min(22vh,200px)] text-foreground"
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
    <SvgFrame title="Discovery animation">
      <defs>
        <linearGradient id={scanId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
          <stop offset="85%" stopColor="currentColor" stopOpacity={0.2} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.45} />
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
        strokeWidth={1.25}
        strokeOpacity={0.35}
      />
      <circle
        className="ps-discovery-ring-b"
        cx={100}
        cy={100}
        r={56}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.35}
        strokeOpacity={0.42}
      />
      <circle
        className="ps-discovery-ring-a"
        cx={100}
        cy={100}
        r={34}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.45}
        strokeOpacity={0.48}
      />
      <circle
        className="ps-discovery-core"
        cx={100}
        cy={100}
        r={9}
        fill="currentColor"
        fillOpacity={0.85}
      />
    </SvgFrame>
  );
}

/** Compass rose with oscillating needle */
export function DirectionAnimation() {
  return (
    <SvgFrame title="Direction animation">
      <circle
        cx={100}
        cy={100}
        r={72}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeOpacity={0.22}
      />
      <g className="ps-direction-ticks" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <line x1={100} y1={36} x2={100} y2={48} opacity={0.9} />
        <line x1={164} y1={100} x2={152} y2={100} opacity={0.35} />
        <line x1={100} y1={164} x2={100} y2={152} opacity={0.35} />
        <line x1={36} y1={100} x2={48} y2={100} opacity={0.35} />
      </g>
      <text
        x={100}
        y={58}
        textAnchor="middle"
        fill="currentColor"
        fillOpacity={0.35}
        className="text-[11px] font-semibold tracking-[0.2em]"
        style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
      >
        N
      </text>
      <g className="ps-direction-needle" style={{ transformOrigin: "100px 118px" }}>
        <path
          d="M 100 42 L 108 118 L 100 108 L 92 118 Z"
          fill="currentColor"
          fillOpacity={0.92}
        />
        <circle cx={100} cy={118} r={8} fill="currentColor" fillOpacity={0.35} />
      </g>
    </SvgFrame>
  );
}

/** Bézier stroke drawing + anchor nodes */
export function DesignAnimation() {
  return (
    <SvgFrame title="Design animation">
      <rect
        x={44}
        y={44}
        width={112}
        height={112}
        rx={8}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeOpacity={0.14}
        strokeDasharray="6 8"
      />
      <path
        className="ps-design-path"
        d="M 42 148 C 42 52 158 52 158 148"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeDasharray={420}
        strokeDashoffset={420}
      />
      <circle className="ps-design-node-a" cx={48} cy={156} r={7} fill="currentColor" />
      <circle className="ps-design-node-c" cx={100} cy={44} r={7} fill="currentColor" />
      <circle className="ps-design-node-b" cx={152} cy={156} r={7} fill="currentColor" />
    </SvgFrame>
  );
}

/** Code brackets, rhythm lines, blinking cursor */
export function DevelopmentAnimation() {
  return (
    <SvgFrame title="Development animation">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          className="ps-dev-bracket-l"
          d="M 72 56 Q 52 56 52 76 V 124 Q 52 144 72 144"
          strokeOpacity={0.85}
        />
        <path
          className="ps-dev-bracket-r"
          d="M 128 56 Q 148 56 148 76 V 124 Q 148 144 128 144"
          strokeOpacity={0.85}
        />
      </g>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <line className="ps-dev-line-a" x1={72} y1={84} x2={128} y2={84} strokeOpacity={0.55} />
        <line className="ps-dev-line-b" x1={72} y1={100} x2={118} y2={100} strokeOpacity={0.55} />
        <line className="ps-dev-line-c" x1={72} y1={116} x2={104} y2={116} strokeOpacity={0.55} />
      </g>
      <rect
        className="ps-dev-cursor"
        x={110}
        y={92}
        width={3}
        height={16}
        rx={1}
        fill="currentColor"
      />
    </SvgFrame>
  );
}

/** Rocket ascent with flame and exhaust wisps */
export function DeploymentAnimation() {
  return (
    <SvgFrame title="Deployment animation">
      <g className="ps-deploy-trail-a" opacity={0.6}>
        <ellipse cx={92} cy={158} rx={6} ry={14} fill="currentColor" fillOpacity={0.15} />
      </g>
      <g className="ps-deploy-trail-b" opacity={0.6}>
        <ellipse cx={108} cy={162} rx={5} ry={12} fill="currentColor" fillOpacity={0.12} />
      </g>
      <g className="ps-deploy-rocket" style={{ transformOrigin: "100px 96px" }}>
        <path
          d="M 100 48 L 118 108 H 125 V 124 H 75 V 108 H 82 Z"
          fill="currentColor"
          fillOpacity={0.88}
        />
        <path d="M 78 108 L 68 124 H 78 Z" fill="currentColor" fillOpacity={0.45} />
        <path d="M 122 108 L 132 124 H 122 Z" fill="currentColor" fillOpacity={0.45} />
        <circle cx={100} cy={72} r={6} fill="currentColor" fillOpacity={0.2} />
      </g>
      <path
        className="ps-deploy-flame"
        d="M 100 124 Q 88 152 100 168 Q 112 152 100 124 Z"
        fill="currentColor"
        fillOpacity={0.55}
      />
    </SvgFrame>
  );
}
