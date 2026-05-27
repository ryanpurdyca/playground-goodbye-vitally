"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { cn } from "@/design-system";
import { COVER_OPEN_ANGLE, NUM_PAGES, PAGE_FAN_SPREAD, PAGE_Z_STEP } from "./constants";

type Props = {
  /** 0 = innermost page (against the back cover), NUM_PAGES-1 = outermost (just inside the front cover). */
  index: number;
  openness: MotionValue<number>;
  /**
   * null  → idle fan mode, rotateY driven by the openness spring.
   * number → reading mode; pages with index < readingPage flip to the left
   *          (COVER_OPEN_ANGLE) and pages with index >= readingPage sit flat at 0°.
   */
  readingPage: number | null;
};

/**
 * A single hinged page. In idle mode pages stagger their opening so that the
 * cover lifts first. In reading mode each page either sits flat on the right
 * (unread) or has flipped to the left (read), animated with a spring so that
 * clicking Next/Back produces a realistic single-page turn.
 */
export function Page({ index, openness, readingPage }: Props) {
  const fanFraction = (index + 1) / (NUM_PAGES + 1);
  const finalAngle = -PAGE_FAN_SPREAD * fanFraction;

  const opensAt = 0.1 + (1 - fanFraction) * 0.5;
  const idleRotateY = useTransform(openness, [opensAt, 1], [0, finalAngle], { clamp: true });

  const translateZ = (index + 1) * PAGE_Z_STEP;

  const isEdgePage = index === NUM_PAGES - 1;
  const isReading = readingPage !== null;
  const readTargetY = isReading ? (index < readingPage ? COVER_OPEN_ANGLE : 0) : 0;

  return (
    <motion.div
      data-testid="book-page"
      data-index={index}
      className={cn(
        "bg-paper absolute inset-0",
        "rounded-l-[8px] rounded-r-[8px]",
        isEdgePage ? "border-accent/70 border" : "border-paper-edge border",
      )}
      style={{
        transformOrigin: "0% 50%",
        transformStyle: "preserve-3d",
        translateZ,
        // In reading mode rotateY is driven by `animate` below; removing it
        // from `style` prevents the MotionValue and animate from conflicting.
        ...(isReading ? {} : { rotateY: idleRotateY }),
      }}
      animate={isReading ? { rotateY: readTargetY } : undefined}
      transition={isReading ? { type: "spring", stiffness: 140, damping: 24 } : undefined}
    >
      {/* Subtle gradient hints at page curvature without using an image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-l-[8px] rounded-r-[8px]"
        style={{
          background:
            "linear-gradient(to right, rgba(11,13,18,0.04) 0%, transparent 8%, transparent 92%, rgba(11,13,18,0.03) 100%)",
        }}
      />
    </motion.div>
  );
}
