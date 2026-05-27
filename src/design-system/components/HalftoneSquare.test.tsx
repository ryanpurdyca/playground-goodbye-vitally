import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { HalftoneSquare } from "./HalftoneSquare";

describe("HalftoneSquare", () => {
  it("renders a resolution × resolution dot grid", () => {
    const { container } = render(<HalftoneSquare size={100} resolution={5} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(25);
  });

  it("has an accessible label", () => {
    const { getByRole } = render(<HalftoneSquare />);
    expect(getByRole("img", { name: /halftone square/i })).toBeInTheDocument();
  });
});
