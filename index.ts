import viteExpress from "vite-express";
import app from "./app";

const host = "localhost";
const port = 3000;

viteExpress.listen(app, port, () => {
  // console.log(`Server running on port ${port} 🚀`);
  console.log(`Server running at http://${host}:${port} 🚀`);
});
