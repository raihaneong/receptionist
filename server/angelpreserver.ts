import "dotenv/config";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";

async function anpr() {
  const inputFilePath = "./stapr-tiktok.md";
  const outputDirPath = "R:\\mv\\ix\\";
  const failed: string[] = [];

  if (!fs.existsSync(inputFilePath)) {
    throw new Error(`Input file does not exist: ${inputFilePath}`);
  }
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  const file = await readFile(inputFilePath, "utf-8");
  const lines = file.split("\n");
  for (const url of lines) {
    const link = url.trim();
    console.log(`processing ${link}`);
    await setTimeout(1000);
    const result = spawnSync(
      "yt-dlp",
      [
        "-S",
        "res:720,abr:100",
        "--cookies-from-browser",
        "firefox:yl976h5e.default-release",
        "--download-archive",
        "./archive_mv.txt",
        "--print-to-file",
        "%(epoch+25200>%y%m%d.%H%M%S)s, %(original_url)s, %(id)s",
        "./log/ytdlpmv.log",
        "--trim-filenames",
        "180",
        "-o",
        `${outputDirPath}/%(extractor)s/%(uploader)s/%(display_id)s %(description).120s.%(ext)s`,
        link,
        "--embed-metadata",
        "--embed-subs",
        "--embed-thumbnail",
      ],
      { stdio: "inherit" },
    );
    if (result.error || result.status !== 0) {
      failed.push(url);
    }
  }
  if (failed.length > 0) {
    const succeeded = lines.filter((url :string) => !failed.includes(url));
    await writeFile("./stapr-tiktok.md", [...failed, ...succeeded].join("\n"));
  }
  console.log("Failed URLs:", failed);
  console.log("proceeding to gallery-dl");

  for (const url of lines) {
    const link = url.trim();
    console.log(`processing ${link}`);
    await setTimeout(1000);
    spawnSync(
      "gallery-dl",
      [
        "-d",
        outputDirPath,
        "--cookies-from-browser",
        "firefox:yl976h5e.default-release",
        "-f",
        "{author[name]|username|user}-{tweet_id|post_shortcode|id}-{num} {desc[:150]|content[:150]|description[:150]}.{extension}",
        "--filter",
        // "extension != 'mp4'",
        "--download-archive",
        "./archive_mv.sqlite",
        link,
        "-v"
      ],
      { stdio: "inherit" },
    );
  }
  console.log("yt-dlp and gallery-dl is done")
}

async function main() {
  try {
    await anpr();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
