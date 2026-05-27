import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Book } from "./Book";
import { NUM_PAGES } from "./constants";

describe("Book", () => {
  it("renders the back cover, a front cover, and one element per page", () => {
    render(<Book />);
    expect(screen.getByTestId("book-root")).toBeInTheDocument();
    expect(screen.getByTestId("book-back-cover")).toBeInTheDocument();
    expect(screen.getByTestId("book-cover")).toBeInTheDocument();
    expect(screen.getAllByTestId("book-page")).toHaveLength(NUM_PAGES);
  });
});
