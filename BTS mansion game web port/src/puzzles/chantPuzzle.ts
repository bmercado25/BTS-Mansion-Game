import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Exact C++ chant string from ChantPuzzle.cpp */
export const CHANT_PHRASE = "EXTINGUE FLAMMAM PECCATORUM TUORUM";

/**
 * Browser port of C++ ChantPuzzle.
 */
export class ChantPuzzle extends Puzzle {
  constructor(puzzleName = "Chant Puzzle") {
    super(puzzleName);
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    ui.displayPrompt("Speak your chant:");
    const input = await ui.userInput();

    if (input === CHANT_PHRASE) {
      this.isSolvedFlag = true;
      return true;
    }

    ui.displayPrompt("Nothing happens... ");
    return false;
  }
}
