import type { UserInterface } from "../userInterface";
import { Puzzle } from "./puzzle";

/** C++ answers from GameControllerClass.cpp */
export const FOUNTAIN_ANSWERS = ["FEAR", "MEMORY", "CLOCK", "GRAVE"] as const;

const RIDDLES = [
  "I can't be touched, yet I can be felt. When I arrive you may yell. Run or fight its your right. What am I?",
  "I linger in shadows, in the dark I dance. I tell tales of old, leaving my mark. What am I?",
  "I have a face, devoid of eyes. I have hands but no arms. What am I?",
  "I guard the resting, in silence I stand. With stones as my sentinels, marking this land. My duty is solemn, my vigil is long. What am I?",
] as const;

/**
 * Browser port of C++ FountainPuzzle.
 * Four riddles, five wrong-attempt budget; exact string matches.
 */
export class FountainPuzzle extends Puzzle {
  private answer1: string;
  private answer2: string;
  private answer3: string;
  private answer4: string;

  constructor(
    ans1 = FOUNTAIN_ANSWERS[0],
    ans2 = FOUNTAIN_ANSWERS[1],
    ans3 = FOUNTAIN_ANSWERS[2],
    ans4 = FOUNTAIN_ANSWERS[3],
  ) {
    super("Fountain Puzzle");
    this.answer1 = ans1;
    this.answer2 = ans2;
    this.answer3 = ans3;
    this.answer4 = ans4;
  }

  async runPuzzle(ui: UserInterface): Promise<boolean> {
    let correctAnswerCount = 0;
    let answerCount = 0;
    const answers = [this.answer1, this.answer2, this.answer3, this.answer4];

    while (answerCount < 5 && !this.isSolvedFlag) {
      if (correctAnswerCount === 4) {
        ui.displayPrompt(
          "All of the panels glow brightly together, as a small flask glows at the bottom of the fountain. You quickly reach into the water and grab the flask as the lights go dim once more.",
        );
        this.isSolvedFlag = true;
        break;
      }

      const riddle = RIDDLES[correctAnswerCount];
      const expected = answers[correctAnswerCount];
      if (!riddle || expected === undefined) {
        break;
      }

      ui.displayPrompt(riddle);
      const input = await ui.userInput();

      if (input === expected) {
        ui.displayPrompt(
          "The fountain panel lights up with a soft blue light, you answered correctly!",
        );
        correctAnswerCount++;
      } else {
        ui.displayPrompt(
          "The fountain panel doesn't respond to your attempt, try again.",
        );
        answerCount++;
      }
    }

    if (correctAnswerCount !== 4) {
      ui.displayPrompt(
        "All of the panels glow a soft red, it seems you have angered something with your lackluster attempts. Hopefully that didn't alert anything.",
      );
      this.isSolvedFlag = false;
    }

    return this.isSolvedFlag;
  }
}
