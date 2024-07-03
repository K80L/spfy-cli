import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { play, next, prev, pause } from "./spfy.js";

yargs(hideBin(process.argv))
  .command(
    "play",
    "Resume the current track",
    () => {},
    () => {
      play();
    },
  )
  .command(
    "pause",
    "Pause the current track",
    () => {},
    () => {
      pause();
    },
  )
  .command(
    "next",
    "Skip to the next track",
    () => {},
    () => {
      next();
    },
  )
  .command(
    "prev",
    "Skip to the previous track",
    () => {},
    () => {
      prev();
    },
  )
  .demand(1)
  .parse();
