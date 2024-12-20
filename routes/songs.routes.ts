import express from "express";
import { getSongs } from "../services/songs.service";

const router = express.Router();

router.get("/", (req, res) => {
  const songs = getSongs();

  res.json(songs);
});

export default router;
