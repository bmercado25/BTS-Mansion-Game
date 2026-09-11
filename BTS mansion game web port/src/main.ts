import "./style.css";
import { createTerminal } from "./terminal";

const root = document.querySelector<HTMLElement>("#terminal");
if (!root) {
  throw new Error("#terminal root not found");
}

const terminal = createTerminal(root);

async function demoLoop(): Promise<void> {
  terminal.clear();
  terminal.print("*** BTS MANSION GAME ***");
  terminal.print("Terminal online. (Phase 1 — shell only)");
  terminal.print("");
  terminal.print("Type something and press Enter.");
  terminal.print("Commands: CLEAR · QUIT");
  terminal.print("");

  while (true) {
    const line = await terminal.ask();

    if (line.toUpperCase() === "QUIT") {
      terminal.print("Demo stopped. Refresh the page to restart.");
      break;
    }

    if (line.toUpperCase() === "CLEAR") {
      terminal.clear();
      terminal.print("Screen cleared.");
      continue;
    }

    if (line === "") {
      terminal.print("(empty line)");
      continue;
    }

    terminal.print(`echo: ${line}`);
  }
}

void demoLoop();
