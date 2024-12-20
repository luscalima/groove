import { fileURLToPath } from "url";
import { resolve } from "path";

const dirname = fileURLToPath(new URL(".", import.meta.url));

export const config = {
  directories: {
    root: dirname,
    artworks: resolve(dirname, "..", "database", "artworks"),
    lyrics: resolve(dirname, "..", "database", "lyrics"),
    audios: resolve(dirname, "..", "database", "audios"),
  },
};
