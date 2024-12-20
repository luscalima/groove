import fs from "fs";
import { config } from "../config";

export function getLyric(artist: string, title: string) {
  const path = `${config.directories.lyrics}/${artist}/${title}.json`;

  if (!fs.existsSync(path)) {
    throw new Error("Lyric not found");
  }

  const file = fs.readFileSync(path, "utf-8");
  return JSON.parse(file);
}
