import fs from "fs";
import { config } from "../config";

export function getArtworkPath(artist: string, title: string): string {
  const path = `${config.directories.artworks}/${artist}/${title}.jpg`;

  if (!fs.existsSync(path)) {
    throw new Error("Artwork not found");
  }

  return path;
}
