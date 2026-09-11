import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** C++ sequence from GameControllerClass.cpp */
export const MAZE_SEQUENCE = ["RABBIT", "CROW", "SNAKE", "SCARAB"] as const;

/** Incorrect animal options from GameControllerClass.cpp */
export const MAZE_INCORRECT = [
  "BADGER",
  "GOAT",
  "CARDINAL",
  "OWL",
  "BEAR",
  "CAT",
  "COYOTE",
] as const;

export const MAZE_HINT = "That lantern... it seemed important.";

/**
 * Browser port of C++ MazePuzzle (animal-path rounds).
 */
export class MazePuzzle extends Puzzle {
  private symbolKey: string[];
  private incorrectSymbols: string[];
  private hint: string;

  constructor(
    seq: string[] = [...MAZE_SEQUENCE],
    incorrect: string[] = [...MAZE_INCORRECT],
    hint = MAZE_HINT,
  ) {
    super("Maze Puzzle");
    this.symbolKey = [...seq];
    this.incorrectSymbols = [...incorrect];
    this.hint = hint;
  }

  private randomInt(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    const ROUNDS = 10;
    let failPuzzle = false;

    ui.displayPrompt(
      "You see multiple animals on the wall, maybe these can help you find your way.",
    );
    for (const symbol of this.symbolKey) {
      ui.displayPrompt(symbol);
    }

    ui.displayPrompt("Press ENTER when you've studied the animals long enough...");
    await ui.userInput();
    ui.clear();

    const corrMax = this.symbolKey.length - 1;
    const incMax = this.incorrectSymbols.length - 1;

    for (let round = 0; round < ROUNDS; round++) {
      if (failPuzzle) {
        break;
      }

      ui.displayPrompt(
        "You see a set of animals all next to different paths, which will you take?",
      );

      let correctAnswer = "";
      const incAns: string[] = [];
      const correctSlot = this.randomInt(0, 3);
      let count = 0;

      for (let i = 0; i < 4; i++) {
        if (i === correctSlot) {
          correctAnswer =
            this.symbolKey[this.randomInt(0, corrMax)] ?? this.symbolKey[0]!;
          ui.displayPrompt(correctAnswer);
        } else if (count === 0) {
          const incAnswer =
            this.incorrectSymbols[this.randomInt(0, incMax)] ??
            this.incorrectSymbols[0]!;
          ui.displayPrompt(incAnswer);
          incAns.push(incAnswer);
        } else {
          let incAnswer =
            this.incorrectSymbols[this.randomInt(0, incMax)] ??
            this.incorrectSymbols[0]!;
          for (const existing of incAns) {
            while (incAnswer === existing) {
              incAnswer =
                this.incorrectSymbols[this.randomInt(0, incMax)] ??
                this.incorrectSymbols[0]!;
            }
          }
          incAns.push(incAnswer);
          ui.displayPrompt(incAnswer);
        }
        count++;
      }

      const userAnswer = await ui.userInput();
      if (userAnswer === "HINT") {
        ui.displayPrompt(this.hint);
      }
      if (userAnswer !== correctAnswer) {
        failPuzzle = true;
      } else {
        ui.clear();
      }
    }

    if (!failPuzzle) {
      this.isSolvedFlag = true;
      ui.displayPrompt("You found your way to the exit!");
    } else {
      ui.displayPrompt(
        "You seem to have lost your way, and ended up back at the beginning of the maze.",
      );
    }

    return this.isSolvedFlag;
  }
}
