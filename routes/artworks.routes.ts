import express from "express";
import { getArtworkPath } from "../services/artworks.service";

const router = express.Router();

router.get("/:artist/:title", (req, res) => {
  try {
    const { artist, title } = req.params;
    const lyric = getArtworkPath(artist, title);

    res.sendFile(lyric);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

export default router;
