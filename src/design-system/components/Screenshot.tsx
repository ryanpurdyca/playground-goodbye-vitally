import type { HTMLAttributes } from "react";
import { cn } from "../cn";

/** Which pin graphic to show at the top (maps to `public/images/pins/pin-N.png`). */
export type ScreenshotPin = 1 | 2 | 3;

/** Slight tilt in degrees. */
export type ScreenshotRotation = -2 | -1 | 0 | 1 | 2;

const PIN_SRC: Record<ScreenshotPin, string> = {
  1: "/images/pins/pin-1.png",
  2: "/images/pins/pin-2.png",
  3: "/images/pins/pin-3.png",
};

const ROTATION_CLASS: Record<ScreenshotRotation, string> = {
  [-2]: "-rotate-2",
  [-1]: "-rotate-1",
  0: "",
  1: "rotate-1",
  2: "rotate-2",
};

interface ScreenshotProps extends HTMLAttributes<HTMLDivElement> {
  /** Path or URL to the screenshot image. */
  image: string;
  /** Alt text for accessibility. */
  alt?: string;
  /** Pin graphic at the top edge (1–3). */
  pin: ScreenshotPin;
  /** Slight rotation in degrees. Defaults to 0. */
  rotation?: ScreenshotRotation;
}

/**
 * Screenshot — an edge-to-edge app screenshot at a fixed 14:9 aspect ratio,
 * pinned to a surface with a push-pin graphic at the top.
 */
export function Screenshot({
  image,
  alt = "",
  pin,
  rotation = 0,
  className,
  style,
  ...rest
}: ScreenshotProps) {
  return (
    <div
      {...rest}
      className={cn("relative inline-block", ROTATION_CLASS[rotation], className)}
      style={style}
    >
      <div
        className="border-rule relative w-full overflow-hidden rounded-[8px] border"
        style={{
          aspectRatio: "14 / 9",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <img
        src={PIN_SRC[pin]}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute top-0 left-1/2 z-10 h-auto w-8 -translate-x-1/2 -translate-y-1/2 object-contain"
      />
    </div>
  );
}
