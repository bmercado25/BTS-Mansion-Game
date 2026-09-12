import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** Portrait names from GameControllerClass.cpp gallery setup. */
export const GALLERY_PORTRAITS = [
  "CRIMSON LORD PORTRAIT",
  "BARKEEP PORTRAIT",
  "SERVANT PORTRAIT",
  "HEIR PORTRAIT",
  "MOB PORTRAIT",
  "TOWN DRUNK PORTRAIT",
  "SERVANT'S SON PORTRAIT",
] as const;

/** Correct touch order: lord → heir → servant. */
export const GALLERY_ANSWERS = [
  "CRIMSON LORD PORTRAIT",
  "HEIR PORTRAIT",
  "SERVANT PORTRAIT",
] as const;

export const GALLERY_HINT =
  "If you are stuck, there is perhaps something left behind by a long dead storyteller that could help you here....";

/**
 * Browser port of C++ GalleryPuzzle.
 * Lists portraits, asks which to touch, checks against the answer sequence.
 */
export class GalleryPuzzle extends Puzzle {
  private portraits: string[];
  private answers: string[];
  private hint: string;

  constructor(
    portraits: string[] = [...GALLERY_PORTRAITS],
    answers: string[] = [...GALLERY_ANSWERS],
    hint = GALLERY_HINT,
  ) {
    super("Gallery Puzzle");
    this.portraits = [...portraits];
    this.answers = [...answers];
    this.hint = hint;
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    ui.clear();

    const userPortraits: string[] = [];
    let answerCount = 0;
    let correctAnswerCount = 0;
    const requiredAnswers = this.answers.length;

    while (answerCount !== requiredAnswers) {
      ui.displayPrompt(
        "The blood in the altar still bubbles with anticipation of your next portrait selection.",
      );
      ui.displayPrompt("");
      ui.displayPrompt("The portraits inside the room are: ");
      ui.displayPrompt("");
      for (const portrait of this.portraits) {
        ui.displayPrompt(portrait);
      }
      ui.displayPrompt("");
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

      ui.clear();
      if (input === "HINT") {
        ui.displayPrompt(this.hint);
      }
    }

    if (correctAnswerCount === requiredAnswers) {
      ui.clear();
      ui.displayPrompt(
        "The blood stops bubbling and calms, revealing half of a bloody dais. You received the gallery half key!",
      );
      this.isSolvedFlag = true;
    } else {
      ui.clear();
      ui.displayPrompt(
        "The blood continues bubbling, disappointed in your order of selections; maybe you need to go back and look for more clues.",
      );
      this.isSolvedFlag = false;
    }

    return this.isSolvedFlag;
  }
}
