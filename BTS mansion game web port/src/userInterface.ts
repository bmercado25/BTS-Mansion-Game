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

  displayPrompt(prompt: string): void {
    this.terminal.print(prompt);
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

  clear(): void {
    this.terminal.clear();
  }

  sleep(ms: number): Promise<void> {
    return this.terminal.sleep(ms);
  }
}
