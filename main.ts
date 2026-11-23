// Day one, day seven — make.fun entry program.
//
// The entry itself is a TikTok video; this program's whole job is to
// hand the house the video's address by copying VIDEO.json from the
// repository into the output directory the grader reads.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

const VIDEO_URL_PATTERN =
  /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/\d+\/?$/;

function readVideoFile(dir: string): string {
  const raw = readFileSync(join(dir, "VIDEO.json"), "utf8");
  const parsed = JSON.parse(raw) as { url?: unknown };
  if (typeof parsed.url !== "string" || parsed.url.length === 0) {
    throw new Error('VIDEO.json must hold a non-empty "url" string');
  }
  if (!VIDEO_URL_PATTERN.test(parsed.url)) {
    throw new Error(
      "VIDEO.json url must be a full TikTok video address: " +
        "https://www.tiktok.com/@<handle>/video/<id>",
    );
  }
  return raw;
}

function main(): void {
  const payload = readVideoFile(botDir);
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "VIDEO.json");
  writeFileSync(target, payload);
  console.log(`VIDEO.json copied to ${target}`);
}

main();
