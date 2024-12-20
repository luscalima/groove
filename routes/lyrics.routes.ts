import express from "express";
import { getLyric } from "../services/lyrics.service";

const router = express.Router();

router.get("/:artist/:title", (req, res) => {
  try {
    const { artist, title } = req.params;
    const lyric = getLyric(artist, title);
    res.json(lyric);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

export default router;
