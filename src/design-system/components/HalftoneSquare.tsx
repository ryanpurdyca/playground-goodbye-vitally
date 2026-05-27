import { cn } from "../cn";

type Props = {
  /** Side length in px. Defaults to a card-friendly size. */
  size?: number;
  /** Dot grid resolution. Higher = finer dots. */
  resolution?: number;
  className?: string;
};

/**
 * HalftoneSquare — pure-SVG halftone fill (no images). Used as the
 * book-cover ornament. Lives in the design system because the same
 * dot motif may appear elsewhere (loading states, empty states).
 */
export function HalftoneSquare({ size = 120, resolution = 22, className }: Props) {
  const cells = Array.from({ length: resolution }, (_, i) => i);
  const step = size / (resolution + 1);
  const r = step * 0.32;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Halftone square"
      className={cn("text-accent", className)}
    >
      <rect
        x={1}
        y={1}
        width={size - 2}
        height={size - 2}
        rx={10}
        ry={10}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {cells.map((row) =>
        cells.map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={(col + 1) * step}
            cy={(row + 1) * step}
            r={r}
            fill="currentColor"
            opacity={0.85}
          />
        )),
      )}
    </svg>
  );
}
