import express from "express";

// Routes
import songsRoutes from "./routes/songs.routes";
import lyricsRoutes from "./routes/lyrics.routes";
import audiosRoutes from "./routes/audios.routes";
import artworksRoutes from "./routes/artworks.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/songs", songsRoutes);
app.use("/lyrics", lyricsRoutes);
app.use("/audios", audiosRoutes);
app.use("/artworks", artworksRoutes);

export default app;
