import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** C++ sequence from GameControllerClass.cpp */
export const MAZE_SEQUENCE = ["RABBIT", "CROW", "SNAKE", "SCARAB"] as const;

/**
 * Browser port of C++ MazePuzzle.
 * Shows the symbol sequence, then asks the player to re-enter it.
 */
export class MazePuzzle extends Puzzle {
  private correctSequence: string[];

  constructor(seq: string[] = [...MAZE_SEQUENCE]) {
    super("Maze Puzzle");
    this.correctSequence = [...seq];
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    const userSequence: string[] = [];

    for (const symbol of this.correctSequence) {
      ui.displayPrompt(symbol);
    }

    ui.displayPrompt("Enter the correct sequence of symbols...");

    for (let i = 0; i < this.correctSequence.length; i++) {
      const input = await ui.userInput();
      userSequence.push(input);
    }

    const matched =
      this.correctSequence.length === userSequence.length &&
      this.correctSequence.every((symbol, index) => symbol === userSequence[index]);

    this.isSolvedFlag = matched;
    return this.isSolvedFlag;
  }
}
