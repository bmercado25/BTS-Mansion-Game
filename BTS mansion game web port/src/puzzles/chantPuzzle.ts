import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Exact C++ chant string from ChantPuzzle.cpp */
export const CHANT_PHRASE = "EXTINGUE FLAMMAM PECCATORUM TUORUM";

export const CHANT_HINT =
  "A bunch of rooms floating in the void? A tank that stores memories? A goblet? This altar? What is it all for?\nPerhaps if you could see with more than just your eyes, this would all be much clearer.";

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

    if (input === "HINT") {
      ui.displayPrompt(CHANT_HINT);
      return false;
    }

    ui.clear();
    ui.displayPrompt("Nothing happens... ");
    return false;
  }
}
