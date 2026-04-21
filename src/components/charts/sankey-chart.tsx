"use client";

import { useMemo } from "react";
import { Sankey, Tooltip, ResponsiveContainer, Layer } from "recharts";

export interface SankeyNode {
  label: string;
  color: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
  color: string;
}

interface HighlightSet {
  nodeSet: Set<number>;
  linkSet: Set<number>;
}

interface SankeyChartProps {
  title?: string;
  subtitle?: string;
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  highlightNodeIndex?: number | null;
}

type RechartsNodeProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: { depth: number; value: number };
};

type RechartsLinkProps = {
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
};

export function SankeyChart({
  title,
  subtitle,
  nodes,
  links,
  height = 560,
  highlightNodeIndex,
}: SankeyChartProps) {
  const data = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ name: n.label })),
      links: links.map((l) => ({ source: l.source, target: l.target, value: l.value })),
    }),
    [nodes, links],
  );

  const maxDepth = useMemo(() => {
    const depth = new Array(nodes.length).fill(0);
    const adj: number[][] = nodes.map(() => []);
    links.forEach((l) => adj[l.source].push(l.target));
    const visit = (u: number, d: number) => {
      depth[u] = Math.max(depth[u], d);
      adj[u].forEach((v) => visit(v, d + 1));
    };
    const hasIncoming = new Array(nodes.length).fill(false);
    links.forEach((l) => (hasIncoming[l.target] = true));
    nodes.forEach((_, i) => {
      if (!hasIncoming[i]) visit(i, 0);
    });
    return Math.max(...depth, 0);
  }, [nodes, links]);

  const highlight = useMemo<HighlightSet | null>(() => {
    if (highlightNodeIndex == null) return null;
    const linkSet = new Set<number>();
    const nodeSet = new Set<number>([highlightNodeIndex]);
    const walk = (idx: number, dir: "up" | "down") => {
      links.forEach((l, i) => {
        if (dir === "down" && l.source === idx && !linkSet.has(i)) {
          linkSet.add(i);
          nodeSet.add(l.target);
          walk(l.target, "down");
        }
        if (dir === "up" && l.target === idx && !linkSet.has(i)) {
          linkSet.add(i);
          nodeSet.add(l.source);
          walk(l.source, "up");
        }
      });
    };
    walk(highlightNodeIndex, "up");
    walk(highlightNodeIndex, "down");
    return { linkSet, nodeSet };
  }, [highlightNodeIndex, links]);

  const renderNode = (p: RechartsNodeProps) => {
    const node = nodes[p.index];
    if (!node) return <Layer />;
    const dimmed = highlight != null && !highlight.nodeSet.has(p.index);
    const isLast = p.payload.depth === maxDepth;
    const lines = node.label.split("\n");
    const textX = isLast ? p.x - 8 : p.x + p.width + 8;
    const anchor = isLast ? "end" : "start";
    const startDy = -((lines.length - 1) * 7);

    return (
      <Layer key={`node-${p.index}`}>
        <rect
          x={p.x}
          y={p.y}
          width={p.width}
          height={Math.max(p.height, 1)}
          fill={node.color}
          rx={3}
          ry={3}
          opacity={dimmed ? 0.2 : 1}
        />
        <text
          x={textX}
          y={p.y + p.height / 2}
          textAnchor={anchor}
          dominantBaseline="middle"
          fontSize={11}
          fill="#334155"
          opacity={dimmed ? 0.25 : 1}
          style={{ fontFamily: '"Microsoft JhengHei", system-ui, sans-serif', pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <tspan key={i} x={textX} dy={i === 0 ? startDy : 14}>
              {line}
            </tspan>
          ))}
        </text>
      </Layer>
    );
  };

  const renderLink = (p: RechartsLinkProps) => {
    const link = links[p.index];
    if (!link) return <path />;
    const dimmed = highlight != null && !highlight.linkSet.has(p.index);
    return (
      <path
        key={`link-${p.index}`}
        d={`M${p.sourceX},${p.sourceY}C${p.sourceControlX},${p.sourceY} ${p.targetControlX},${p.targetY} ${p.targetX},${p.targetY}`}
        stroke={link.color}
        strokeWidth={p.linkWidth}
        fill="none"
        strokeOpacity={dimmed ? 0.08 : 1}
      />
    );
  };

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            node={renderNode}
            link={renderLink}
            nodePadding={22}
            nodeWidth={14}
            iterations={64}
            margin={{ top: 16, right: 140, bottom: 16, left: 90 }}
          >
            <Tooltip
              formatter={(v) => [`${v} 人`, "人次"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                fontFamily: '"Microsoft JhengHei", system-ui, sans-serif',
              }}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
