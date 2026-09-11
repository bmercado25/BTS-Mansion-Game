import type { Terminal } from "./terminal";
import { pentacleArt } from "./pentacles";

/**
 * Browser port of C++ UserInterfaceClass.
 * Display / input go through the terminal shell (print / ask / printPre).
 */
export class UserInterface {
  private currentInput = "";
  private readonly terminal: Terminal;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  /**
   * Plain prompt, or sanity-jumbled text when `sanity` is passed
   * (C++ overload displayPrompt(prompt, sanityLevel)).
   */
  displayPrompt(prompt: string, sanity?: number): void {
    if (sanity === undefined) {
      this.terminal.print(prompt);
      return;
    }
    this.terminal.print(this.formatSanityPrompt(prompt, sanity));
  }

  displayMenu(): void {
    this.terminal.print("***Welcome to the BTS Mansion Game!***");
    this.terminal.print("===== Main Menu =====");
    this.terminal.print("START Game");
    this.terminal.print("QUIT");
    this.terminal.print("=====================");
    this.terminal.print(
      "Words in all caps will be input options for this game, please enter an option:",
    );
  }

  async userInput(): Promise<string> {
    const input = await this.terminal.ask();
    this.setCurrentInput(input);
    return input.trim();
  }

  setCurrentInput(uInput: string): void {
    this.currentInput = uInput;
  }

  getCurrentInput(): string {
    return this.currentInput;
  }

  /** Stub — matches C++ TODO (always true for now). */
  isValidInput(_options: string[]): boolean {
    return true;
  }

  /**
   * Wait for Enter (empty line) to continue story.
   * Also accepts PICKUP, matching C++ waitForInput().
   */
  async waitForInput(): Promise<void> {
    while (true) {
      const input = await this.terminal.ask();
      if (input === "" || input === "PICKUP") {
        return;
      }
      this.terminal.print("Invalid input, please press Enter key to continue story");
    }
  }

  displayPentacle(candleVal: number): void {
    this.terminal.printPre(pentacleArt(candleVal));
  }

  displayPre(block: string): void {
    this.terminal.printPre(block);
  }

  clear(): void {
    this.terminal.clear();
  }

  sleep(ms: number): Promise<void> {
    return this.terminal.sleep(ms);
  }

  /** Unblock a waiting ask() (sanity game-over / quit). */
  cancelAsk(): void {
    this.terminal.cancelAsk();
  }

  /** Split, jumble non-ALL-CAPS words when sanity is low, rejoin. */
  private formatSanityPrompt(prompt: string, sanity: number): string {
    const words = prompt.split(/\s+/).filter((w) => w.length > 0);
    const jumbled = words.map((word) => this.jumbleWord(word, sanity));
    return jumbled.join(" ");
  }

  /** C++ is_all_uppercase — skip jumbling keywords. */
  private isAllUppercase(word: string): boolean {
    const letters = word.replace(/[^A-Za-z]/g, "");
    if (letters.length === 0) {
      return false;
    }
    return letters === letters.toUpperCase();
  }

  /**
   * Port of UserInterfaceClass::jumble_word.
   * No jumble when sanity >= 35, ALL CAPS, or length <= 2.
   */
  private jumbleWord(word: string, intensity: number): string {
    if (this.isAllUppercase(word)) {
      return word;
    }
    if (intensity >= 35) {
      return word;
    }
    if (word.length <= 2) {
      return word;
    }

    const jumbleFactor = 1.0 - intensity / 100.0;
    if (jumbleFactor <= 0.1) {
      return word;
    }

    const chars = [...word];
    if (jumbleFactor > 0.5) {
      const numSwaps = Math.floor(word.length * jumbleFactor);
      for (let i = 0; i < numSwaps; i++) {
        // Skip first character (match C++ idx range on length-1 starting at 1).
        const idx1 = 1 + Math.floor(Math.random() * (word.length - 1));
        const idx2 = 1 + Math.floor(Math.random() * (word.length - 1));
        const a = chars[idx1];
        const b = chars[idx2];
        if (a !== undefined && b !== undefined) {
          chars[idx1] = b;
          chars[idx2] = a;
        }
      }
    } else if (chars.length > 2) {
      // Slight shuffle of middle characters.
      const mid = chars.slice(1, -1);
      for (let i = mid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = mid[i]!;
        mid[i] = mid[j]!;
        mid[j] = tmp;
      }
      return chars[0]! + mid.join("") + chars[chars.length - 1]!;
    }

    return chars.join("");
  }
}
