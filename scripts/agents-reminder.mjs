#!/usr/bin/env node
/**
 * Pre-commit nudge that fails the commit when a substantive change is staged
 * without an accompanying update to AGENTS.md.
 *
 * The intent is to keep AGENTS.md a living document: any change that adds
 * architecture, technologies, product structure, or design-decision context
 * should be reflected there so future agents inherit the context.
 *
 * Bypass with: SKIP_AGENTS_CHECK=1 git commit ... (use sparingly).
 */
import { execSync } from "node:child_process";

if (process.env.SKIP_AGENTS_CHECK === "1") {
  console.log("[agents-reminder] SKIP_AGENTS_CHECK=1 — skipping AGENTS.md check.");
  process.exit(0);
}

const staged = execSync("git diff --cached --name-only", { encoding: "utf8" })
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

if (staged.length === 0) process.exit(0);

const ignorable = (p) =>
  p === "AGENTS.md" ||
  p === "CLAUDE.md" ||
  p === "README.md" ||
  p.startsWith(".husky/") ||
  p.endsWith(".lock") ||
  p === "package-lock.json" ||
  p.endsWith(".md") ||
  p.endsWith(".png") ||
  p.endsWith(".jpg") ||
  p.endsWith(".svg") ||
  p.endsWith(".ico");

const meaningful = staged.filter((p) => !ignorable(p));
const touchedAgents = staged.includes("AGENTS.md");

if (meaningful.length > 0 && !touchedAgents) {
  console.error("");
  console.error("┌─────────────────────────────────────────────────────────────────────┐");
  console.error("│ AGENTS.md was not updated alongside these changes:                  │");
  console.error("├─────────────────────────────────────────────────────────────────────┤");
  for (const p of meaningful.slice(0, 10)) {
    console.error(`│  • ${p.padEnd(64)} │`);
  }
  if (meaningful.length > 10) {
    console.error(`│  …and ${(meaningful.length - 10).toString().padEnd(60)} more     │`);
  }
  console.error("├─────────────────────────────────────────────────────────────────────┤");
  console.error("│ Update AGENTS.md to capture any new architecture, tech, structure,  │");
  console.error("│ decisions, or trade-offs introduced by this change.                 │");
  console.error("│                                                                     │");
  console.error("│ If this change is genuinely irrelevant to AGENTS.md, bypass with:   │");
  console.error("│   SKIP_AGENTS_CHECK=1 git commit ...                                │");
  console.error("└─────────────────────────────────────────────────────────────────────┘");
  process.exit(1);
}

process.exit(0);
