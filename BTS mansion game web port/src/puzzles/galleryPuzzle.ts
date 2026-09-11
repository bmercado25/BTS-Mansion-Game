import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Portrait names available in the C++ gallery setup. */
export const GALLERY_PORTRAITS = [
  "CRIMSON LORD PORTRAIT",
  "BARKEEP PORTRAIT",
] as const;

/** Correct touch order from GameControllerClass.cpp (lord only for now). */
export const GALLERY_ANSWERS = ["CRIMSON LORD PORTRAIT"] as const;

/**
 * Browser port of C++ GalleryPuzzle.
 * Lists portraits, asks which to touch, checks against the answer sequence.
 */
export class GalleryPuzzle extends Puzzle {
  private portraits: string[];
  private answers: string[];

  constructor(
    portraits: string[] = [...GALLERY_PORTRAITS],
    answers: string[] = [...GALLERY_ANSWERS],
  ) {
    super("Gallery Puzzle");
    this.portraits = [...portraits];
    this.answers = [...answers];
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    const userPortraits: string[] = [];
    let answerCount = 0;
    let correctAnswerCount = 0;
    const requiredAnswers = this.answers.length;

    while (answerCount !== requiredAnswers) {
      ui.displayPrompt("The portraits inside the room are: ");
      for (const portrait of this.portraits) {
        ui.displayPrompt(portrait);
      }

      ui.displayPrompt("Choose which portrait to touch.");
      const input = await ui.userInput();

      for (const portrait of this.portraits) {
        if (portrait === input) {
          userPortraits.push(portrait);
          answerCount++;

          const expected = this.answers[answerCount - 1];
          if (expected === userPortraits[answerCount - 1]) {
            correctAnswerCount++;
          }
        }
      }
    }

    if (correctAnswerCount === requiredAnswers) {
      ui.displayPrompt(
        "You successfully solved the Storyteller's Poem! You recieved the gallery half key",
      );
      this.isSolvedFlag = true;
    } else {
      ui.displayPrompt("You failed to solve the Storyteller's Poem!");
      this.isSolvedFlag = false;
    }

    return this.isSolvedFlag;
  }
}
