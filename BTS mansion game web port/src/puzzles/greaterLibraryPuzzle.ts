import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Exact C++ solution from GameControllerClass.cpp */
export const GREATER_LIBRARY_ANSWER = "DODGE";

export const GREATER_LIBRARY_HINT =
  "Some of the books in this room stand out to you. Perhaps they contain some sort of code?";

/**
 * Browser port of C++ GreaterLibraryPuzzle.
 * Answer is exact and case-sensitive (`DODGE`). `HINT` reprints the hint.
 */
export class GreaterLibraryPuzzle extends Puzzle {
  private answer: string;
  private hint: string;

  constructor(
    solution = GREATER_LIBRARY_ANSWER,
    hint = GREATER_LIBRARY_HINT,
  ) {
    super("Greater Library Puzzle");
    this.answer = solution;
    this.hint = hint;
  }

  getHint(): string {
    return this.hint;
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    while (true) {
      ui.displayPrompt("Enter the combination: ");
      const input = await ui.userInput();

      if (input === this.answer) {
        ui.clear();
        ui.displayPrompt(
          "You input the correct word, finding a key inside which you grab before seeing a poison dart ready to fire at you which you narrowly dodge. You obtained the STUDY KEY!",
        );
        this.isSolvedFlag = true;
        return true;
      }

      if (input === "HINT") {
        ui.displayPrompt(this.hint);
        continue;
      }

      ui.clear();
      ui.displayPrompt("That word doesn't seem to unlock the lock.");
      return false;
    }
  }
}
