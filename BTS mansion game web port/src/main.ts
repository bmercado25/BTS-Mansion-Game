import "./style.css";
import { createTerminal } from "./terminal";
import { UserInterface } from "./userInterface";
import { GameController } from "./gameController";
import { runDomainSmokeDemo } from "./domain/smokeDemo";
import { gameAudio } from "./audio";

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

function syncMuteButton(button: HTMLButtonElement): void {
  const muted = gameAudio.isMuted();
  button.setAttribute("aria-pressed", muted ? "true" : "false");
  button.textContent = muted ? "Sound: Off" : "Sound: On";
  button.title = muted ? "Unmute game audio" : "Mute game audio";
}

function wireMuteToggle(): void {
  const button = document.querySelector<HTMLButtonElement>("#audio-mute");
  if (!button) {
    return;
  }
  syncMuteButton(button);
  button.addEventListener("click", () => {
    gameAudio.unlock();
    gameAudio.toggleMute();
    syncMuteButton(button);
  });
}

/** First keypress / click unlocks audio for later SFX (autoplay policy). */
function wireAudioUnlock(): void {
  const unlock = () => {
    gameAudio.unlock();
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
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
    gameAudio.unlock();

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
      ui.displayPentacle(5);
      continue;
    }

    ui.displayPrompt("Invalid choice. Please try again.");
  }
}

wireMuteToggle();
wireAudioUnlock();
void menuFlow();
