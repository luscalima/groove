import fs from "fs";
import { config } from "../config";

type AudioMetadata = {
  fileSize: number;
  mimeType: string;
  start?: number;
  end?: number;
  chunkSize?: number;
};

type Range = [number, number?];

type AudioStream = {
  stream: fs.ReadStream;
  metadata: AudioMetadata;
};

export function getAudioPath(artist: string, title: string): string {
  const path = `${config.directories.audios}/${artist}/${title}.mp3`;

  if (!fs.existsSync(path)) {
    throw new Error("Audio not found");
  }

  return path;
}

export function getAudioMetadata(path: string): AudioMetadata {
  const stat = fs.statSync(path);

  return {
    fileSize: stat.size,
    mimeType: "audio/mpeg",
  };
}

export function createAudioStream(path: string, range?: Range): AudioStream {
  const metadata = getAudioMetadata(path);

  if (!range) {
    return {
      stream: fs.createReadStream(path),
      metadata,
    };
  }

  let [start, end] = range;

  if (!end) {
    end = metadata.fileSize - 1;
  }

  const chunkSize = end - start + 1;

  if (start >= metadata.fileSize || end >= metadata.fileSize) {
    throw new Error("Requested range not satisfiable");
  }

  return {
    stream: fs.createReadStream(path, { start, end }),
    metadata: {
      ...metadata,
      chunkSize,
      start,
      end,
    },
  };
}
