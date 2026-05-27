"use client";

import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";
import { cn } from "@/design-system";

export type BookMode = "idle" | "reading";

type Props = {
  openness: MotionValue<number>;
  mode: BookMode;
  currentPage: number;
  onRead: () => void;
  onCancel: () => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
};

export function BookButtons({
  openness,
  mode,
  currentPage,
  onRead,
  onCancel,
  onNext,
  onBack,
  onClose,
}: Props) {
  const [interactive, setInteractive] = useState(false);

  useMotionValueEvent(openness, "change", (v) => {
    setInteractive(v > 0.15);
  });

  const isReading = mode === "reading";
  const leftLabel = isReading ? (currentPage === 0 ? "Close" : "Back") : "Read";
  const rightLabel = isReading ? "Next" : "Cancel";
  const handleLeft = isReading ? (currentPage === 0 ? onClose : onBack) : onRead;
  const handleRight = isReading ? onNext : onCancel;

  return (
    <motion.div
      className="absolute flex items-center justify-between"
      style={{
        left: "calc(50vw - var(--book-width))",
        top: "calc(50vh + var(--book-height) / 2 + 1.5rem)",
        width: "calc(var(--book-width) * 2)",
        opacity: openness,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <Btn onClick={handleLeft}>{leftLabel}</Btn>
      <Btn onClick={handleRight}>{rightLabel}</Btn>
    </motion.div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border px-5 py-2 text-sm font-medium",
        "border-accent/40 text-ink-muted bg-transparent",
        "hover:border-accent hover:text-ink transition-colors duration-150",
      )}
    >
      {children}
    </button>
  );
}
