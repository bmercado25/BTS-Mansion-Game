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
  button.setAttribute(
    "aria-label",
    muted ? "Unmute game audio" : "Mute game audio",
  );
  button.title = muted ? "Unmute game audio" : "Mute game audio";
}

function wireAudioControls(): void {
  const button = document.querySelector<HTMLButtonElement>("#audio-mute");
  const slider = document.querySelector<HTMLInputElement>("#audio-volume");

  if (slider) {
    slider.value = String(Math.round(gameAudio.getVolume() * 100));
    const applyVolume = () => {
      void gameAudio.unlockAsync();
      gameAudio.setVolume(Number(slider.value) / 100);
    };
    slider.addEventListener("input", applyVolume);
    slider.addEventListener("change", applyVolume);
  }

  if (button) {
    syncMuteButton(button);
    button.addEventListener("click", () => {
      void gameAudio.unlockAsync();
      gameAudio.toggleMute();
      syncMuteButton(button);
    });
  }
}

/**
 * Keep trying on every gesture until the AudioContext is actually running.
 * (once:true was wrong — a failed/early unlock left ambient dead until the
 * volume slider resumed the context again.)
 */
function wireAudioUnlock(): void {
  const unlock = () => {
    void gameAudio.unlockAsync();
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
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
    await gameAudio.unlockAsync();

    if (command === "START" || command === "START GAME") {
      await gameAudio.enterGameplay();
      await game.startGame();
      ui.displayPrompt("");
      ui.displayPrompt("Press Enter to return to the menu.");
      await ui.waitForInput();
      await gameAudio.unlockAsync();
      gameAudio.enterMenu();
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

wireAudioControls();
wireAudioUnlock();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const pinTop = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};
pinTop();
window.addEventListener("scroll", pinTop, { passive: true });
window.setTimeout(() => {
  window.removeEventListener("scroll", pinTop);
}, 1200);

void menuFlow();

// ask() focuses the input after the menu paints — re-pin once that settles.
requestAnimationFrame(() => {
  pinTop();
  requestAnimationFrame(pinTop);
});
window.setTimeout(pinTop, 0);
window.setTimeout(pinTop, 100);
window.setTimeout(pinTop, 300);
