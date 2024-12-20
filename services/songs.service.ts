import fs from "fs";
import { songs } from "../database";

export function getSongs() {
  return songs;
}
