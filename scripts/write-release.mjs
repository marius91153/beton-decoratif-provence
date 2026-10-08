import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const commit = execFileSync("git", ["rev-parse", "--verify", "HEAD"], {
  encoding: "utf8",
}).trim();
const dirty = Boolean(
  execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], {
    encoding: "utf8",
  }).trim(),
);

if (process.env.GITHUB_ACTIONS && process.env.GITHUB_SHA !== commit) {
  throw new Error("The build does not match the workflow's source commit.");
}

writeFileSync("dist/release.json", JSON.stringify({ commit, dirty }) + "\n");
