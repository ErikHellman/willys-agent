import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read SKILL.md from package root (works both in src/ during dev and dist/ after build)
function loadSkillMd(): string {
  // Try package root first (one level up from src/ or dist/)
  for (const base of [join(__dirname, ".."), __dirname]) {
    try {
      return readFileSync(join(base, "SKILL.md"), "utf-8");
    } catch {
      // try next
    }
  }
  throw new Error("SKILL.md not found");
}

export const SKILL_MD = loadSkillMd();
