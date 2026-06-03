"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "@/design-system";
import {
  PEOPLE_CLOUD_AREA_FILL,
  PEOPLE_CLOUD_EDGE_PAD_PX,
  PEOPLE_CLOUD_GAP_PX,
  PEOPLE_CLOUD_RELAX_ITERATIONS,
  PEOPLE_CLOUD_SOLVE_ITERATIONS,
  PEOPLE_CLOUD_STABLE_THRESHOLD,
} from "./constants";
import { useBookReadingNav } from "./BookReadingContext";
import { people, type Person } from "./people";

type SimBubble = Person & {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  r: number;
};

function computeBaseRadius(width: number, height: number, count: number): number {
  return Math.sqrt((PEOPLE_CLOUD_AREA_FILL * width * height) / (count * Math.PI));
}

function clampBubble(b: SimBubble, width: number, height: number) {
  const pad = PEOPLE_CLOUD_EDGE_PAD_PX;
  b.x = Math.max(b.r + pad, Math.min(width - b.r - pad, b.x));
  b.y = Math.max(b.r + pad, Math.min(height - b.r - pad, b.y));
}

function resolvePair(a: SimBubble, b: SimBubble, gap: number): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let dist = Math.hypot(dx, dy);
  const minDist = a.r + b.r + gap;
  if (dist < 1e-4) {
    dist = 1e-4;
  }
  if (dist >= minDist) return 0;

  const overlap = minDist - dist;
  const nx = dx / dist;
  const ny = dy / dist;

  const half = overlap / 2;
  const ax = a.x;
  const ay = a.y;
  const bx = b.x;
  const by = b.y;
  a.x -= nx * half;
  a.y -= ny * half;
  b.x += nx * half;
  b.y += ny * half;
  return Math.max(Math.abs(a.x - ax), Math.abs(a.y - ay), Math.abs(b.x - bx), Math.abs(b.y - by));
}

function relaxPass(bubbles: SimBubble[], width: number, height: number): number {
  let maxMove = 0;
  for (let iter = 0; iter < PEOPLE_CLOUD_RELAX_ITERATIONS; iter++) {
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        maxMove = Math.max(maxMove, resolvePair(bubbles[i], bubbles[j], PEOPLE_CLOUD_GAP_PX));
      }
    }
    for (const b of bubbles) {
      const prevX = b.x;
      const prevY = b.y;
      clampBubble(b, width, height);
      maxMove = Math.max(maxMove, Math.abs(b.x - prevX), Math.abs(b.y - prevY));
    }
  }
  return maxMove;
}

function solveLayout(bubbles: SimBubble[], width: number, height: number): void {
  for (let pass = 0; pass < PEOPLE_CLOUD_SOLVE_ITERATIONS; pass++) {
    const moved = relaxPass(bubbles, width, height);
    if (moved < PEOPLE_CLOUD_STABLE_THRESHOLD) break;
  }
}

function seedHomeLayout(width: number, height: number, baseR: number): SimBubble[] {
  const n = people.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const maxDist = Math.min(width, height) * 0.38;

  const bubbles: SimBubble[] = people.map((p, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const angle = i * golden;
    const dist = Math.sqrt(t) * maxDist;
    const x = width / 2 + Math.cos(angle) * dist;
    const y = height / 2 + Math.sin(angle) * dist;
    return {
      ...p,
      x,
      y,
      homeX: x,
      homeY: y,
      r: baseR,
    };
  });

  solveLayout(bubbles, width, height);

  for (const b of bubbles) {
    b.homeX = b.x;
    b.homeY = b.y;
  }

  return bubbles;
}

export function PeopleCloud() {
  const readingNav = useBookReadingNav();
  const interactive = readingNav?.peopleCloudInteractive ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [homeBubbles, setHomeBubbles] = useState<SimBubble[]>([]);
  const [baseR, setBaseR] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipViewport, setTooltipViewport] = useState<{ x: number; y: number } | null>(null);

  const activeHoveredId = interactive ? hoveredId : null;

  const initLayout = useCallback((width: number, height: number) => {
    const r = computeBaseRadius(width, height, people.length);
    const home = seedHomeLayout(width, height, r);
    setHomeBubbles(home);
    setBaseR(r);
    setSize({ width, height });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        initLayout(width, height);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [initLayout]);

  const hoveredHome = activeHoveredId ? homeBubbles.find((b) => b.id === activeHoveredId) : null;

  const setBubbleRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) bubbleRefs.current.set(id, el);
    else bubbleRefs.current.delete(id);
  }, []);

  useEffect(() => {
    if (!activeHoveredId) return;

    let rafId = 0;
    let active = true;

    const updateTooltip = () => {
      if (!active) return;
      const el = bubbleRefs.current.get(activeHoveredId);
      if (el) {
        const box = el.getBoundingClientRect();
        setTooltipViewport({
          x: box.left + box.width / 2,
          y: box.top,
        });
      }
      rafId = requestAnimationFrame(updateTooltip);
    };

    updateTooltip();
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [activeHoveredId]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      data-testid="people-cloud"
    >
      {size.width > 0 &&
        baseR > 0 &&
        homeBubbles.map((b) => {
          const d = baseR * 2;
          return (
            <div
              key={b.id}
              ref={(el) => setBubbleRef(b.id, el)}
              data-people-bubble
              className={
                interactive
                  ? "pointer-events-auto absolute overflow-hidden rounded-full"
                  : "pointer-events-none absolute overflow-hidden rounded-full"
              }
              style={{
                left: b.homeX - baseR,
                top: b.homeY - baseR,
                width: d,
                height: d,
                zIndex: b.id === activeHoveredId ? 20 : 1,
              }}
              onMouseEnter={
                interactive
                  ? () => {
                      setHoveredId(b.id);
                      readingNav?.onRightPagePointer();
                    }
                  : undefined
              }
              onClick={interactive ? () => readingNav?.onRightPageClick() : undefined}
              onMouseLeave={
                interactive
                  ? () => {
                      setHoveredId(null);
                      setTooltipViewport(null);
                    }
                  : undefined
              }
            >
              <Image
                src={b.src}
                alt={b.name}
                fill
                sizes={`${Math.ceil(d)}px`}
                className="object-cover"
                draggable={false}
              />
            </div>
          );
        })}

      {interactive &&
        hoveredHome &&
        tooltipViewport &&
        typeof document !== "undefined" &&
        createPortal(
          <Tooltip
            label={hoveredHome.name}
            x={tooltipViewport.x}
            y={tooltipViewport.y}
            position="fixed"
            gapPx={12}
            visible={activeHoveredId !== null}
          />,
          document.body,
        )}
    </div>
  );
}
