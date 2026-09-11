import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Default C++ mirror solution from GameControllerClass.cpp */
export const MIRROR_SOLUTION = ["MOONLIGHT", "FOREST GREEN", "BLACK"] as const;

/**
 * Browser port of C++ MirrorPuzzle.
 * Asks for three words and compares to the correct sequence.
 */
export class MirrorPuzzle extends Puzzle {
  private answers: string[] = [];
  private correctAnswers: string[];

  constructor(correctAnswers: string[] = [...MIRROR_SOLUTION]) {
    super("Mirror Puzzle");
    this.correctAnswers = [...correctAnswers];
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    this.answers = [];

    for (let i = 0; i < 3; i++) {
      ui.displayPrompt("Enter word: ");
      const word = await ui.userInput();
      this.answers.push(word);
    }

    const matched =
      this.answers.length === this.correctAnswers.length &&
      this.answers.every((answer, index) => answer === this.correctAnswers[index]);

    if (matched) {
      this.isSolvedFlag = true;
    }

    this.answers = [];
    return this.isSolvedFlag;
  }
}
