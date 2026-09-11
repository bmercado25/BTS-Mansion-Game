import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

export const MEMORY_HINT = "Trust in your memory.";

/**
 * Browser port of C++ MemoryPuzzle.
 * Timed letter reveal via sleep(); clear() instead of system("cls").
 */
export class MemoryPuzzle extends Puzzle {
  private hint: string;

  constructor(puzzleName = "Memory Puzzle", hint = MEMORY_HINT) {
    super(puzzleName);
    this.hint = hint;
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    const STARTING_LENGTH = 2;
    const FINAL_LENGTH = 5;
    let toContinue = true;

    ui.displayPrompt(
      "You place your hand on the tank, they are testing your memory, you must recite the memories that they tell you",
    );

    for (let i = STARTING_LENGTH; i <= FINAL_LENGTH && toContinue; i++) {
      const sequence = this.randomLetterString(i);
      toContinue = await this.displayLetters(sequence, ui);
    }

    if (toContinue) {
      this.isSolvedFlag = true;
    }

    return this.isSolvedFlag;
  }

  /**
   * Matches C++ randomLetterString, including the off-by-one (`i <= length`).
   */
  randomLetterString(length: number): string {
    let sequence = "";
    for (let i = 0; i <= length; i++) {
      const letter = String.fromCharCode(
        "A".charCodeAt(0) + Math.floor(Math.random() * 26),
      );
      sequence += letter;
    }
    return sequence;
  }

  async displayLetters(
    sequence: string,
    ui: UserInterface,
  ): Promise<boolean> {
    await ui.sleep(800);

    for (let i = 0; i < sequence.length; i++) {
      await ui.sleep(800);
      // C++ prints on one cout line; browser prints each letter as its own line.
      ui.displayPrompt(`${sequence[i]} `);
      await ui.sleep(800);
    }

    await ui.sleep(3000);
    ui.clear();

    ui.displayPrompt("Recite the memory");
    const input = await ui.userInput();

    if (input === sequence) {
      ui.displayPrompt("The memories react");
      return true;
    }

    if (input === "HINT") {
      ui.displayPrompt(this.hint);
      return false;
    }

    ui.displayPrompt("eeeeeeeThe memories stop reacting");
    return false;
  }
}
