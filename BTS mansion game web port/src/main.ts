import "./style.css";
import { createTerminal } from "./terminal";
import { UserInterface } from "./userInterface";
import { GameController } from "./gameController";
import { runDomainSmokeDemo } from "./domain/smokeDemo";

const root = document.querySelector<HTMLElement>("#terminal");
if (!root) {
  throw new Error("#terminal root not found");
}

const terminal = createTerminal(root);
const ui = new UserInterface(terminal);
const game = new GameController(ui);

function normalizeCommand(raw: string): string {
  return raw.trim().toUpperCase();
}

function wantsDomainDemo(): boolean {
  return new URLSearchParams(window.location.search).get("demo") === "domain";
}

async function menuFlow(): Promise<void> {
  ui.clear();

  if (wantsDomainDemo()) {
    await runDomainSmokeDemo(ui);
  }

  ui.clear();
  ui.displayMenu();

  while (true) {
    const command = normalizeCommand(await ui.userInput());

    if (command === "START" || command === "START GAME") {
      await game.startGame();
      ui.displayPrompt("");
      ui.displayPrompt("Press Enter to return to the menu.");
      await ui.waitForInput();
      ui.clear();
      ui.displayMenu();
      continue;
    }

    if (command === "DEMO") {
      await runDomainSmokeDemo(ui);
      ui.clear();
      ui.displayMenu();
      continue;
    }

    if (command === "QUIT") {
      ui.displayPrompt("Goodbye.");
      break;
    }

    if (command === "PENTACLE") {
      ui.displayPentacle(3);
      continue;
    }

    ui.displayPrompt("Invalid choice. Please try again.");
  }
}

void menuFlow();
