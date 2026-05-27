import { cn } from "../cn";
import type { HTMLAttributes } from "react";

/**
 * Stage — full-viewport, centered surface used to host hero content.
 * It is a design-system primitive so any future top-level scene gets the
 * same dimensions, background, and overflow behavior for free.
 */
export function Stage({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "bg-canvas relative flex h-dvh w-screen items-center justify-center overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
