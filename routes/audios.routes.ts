import express from "express";
import { getAudioPath, createAudioStream } from "../services/audios.service";

const router = express.Router();

router.get("/:artist/:title", (req, res) => {
  try {
    const { artist, title } = req.params;
    const { range } = req.headers;
    const audioPath = getAudioPath(artist, title);

    res.set("Cache-Control", "public, max-age=3600");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : undefined;

      const { stream, metadata } = createAudioStream(audioPath, [start, end]);

      res.writeHead(206, {
        "Content-Range": `bytes ${metadata.start}-${metadata.end}/${metadata.fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": metadata.chunkSize,
        "Content-Type": metadata.mimeType,
      });

      stream.pipe(res);
    } else {
      const { stream, metadata } = createAudioStream(audioPath);

      res.writeHead(200, {
        "Content-Type": metadata.mimeType,
        "Content-Length": metadata.fileSize,
        "Accept-Ranges": "bytes",
      });

      stream.pipe(res);
    }
  } catch (error) {
    if (error.message === "Requested range not satisfiable") {
      res.status(416).send(error.message);
    } else {
      res.status(404).send(error.message);
    }
  }
});

export default router;
