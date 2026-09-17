import type { LineKind, StatusInfo, Terminal } from "./terminal";
import { pentacleArt } from "./pentacles";

type NoticeLine = {
  text: string;
  kind: LineKind;
};

/**
 * Browser port of C++ UserInterfaceClass.
 * Display / input go through the terminal shell (print / ask / printPre).
 */
export class UserInterface {
  private currentInput = "";
  private readonly terminal: Terminal;
  /** Feedback kept for the next room frame (doors, unlocks, interact, etc.). */
  private pendingNotices: NoticeLine[] = [];
  private suppressNoticeCapture = false;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
  }

  private captureNotice(text: string, kind: LineKind): void {
    if (this.suppressNoticeCapture) {
      return;
    }
    this.pendingNotices.push({ text, kind });
  }

  /**
   * Plain prompt, or sanity-jumbled text when `sanity` is passed
   * (C++ overload displayPrompt(prompt, sanityLevel)).
   */
  displayPrompt(prompt: string, sanity?: number): void {
    if (sanity === undefined) {
      this.terminal.print(prompt, "body");
      this.captureNotice(prompt, "body");
      return;
    }
    const text = this.formatSanityPrompt(prompt, sanity);
    this.terminal.print(text, "room");
    this.captureNotice(text, "room");
  }

  displayLine(text: string, kind: LineKind = "body"): void {
    this.terminal.print(text, kind);
    this.captureNotice(text, kind);
  }

  displayDivider(): void {
    this.terminal.print("", "divider");
    this.captureNotice("", "divider");
  }

  setStatus(info: StatusInfo): void {
    this.terminal.setStatus(info);
  }

  setPlaceholder(text: string): void {
    this.terminal.setPlaceholder(text);
  }

  displayMenu(): void {
    this.pendingNotices = [];
    this.terminal.clearBanner();
    this.terminal.clear();
    this.terminal.setStatus({ room: "MENU", sanity: null });
    this.terminal.setPlaceholder("");
    this.suppressNoticeCapture = true;
    this.terminal.print("Malum", "heading");

    this.terminal.print("===== Main Menu =====", "system");
    this.terminal.print("START Game", "exits");
    this.terminal.print("QUIT", "exits");
    this.terminal.print("=====================", "system");
    this.terminal.print(
      "Words in all caps will be input options for this game, please enter an option:",
      "dim",
    );
    this.suppressNoticeCapture = false;
  }

  /**
   * Frame a room turn: name, description, exits.
   * Pending interaction feedback goes into the EVENT banner above the log.
   */
  displayRoomTurn(options: {
    roomName: string;
    sanity: number;
    description: string;
    exits: string[];
    jumbleSanity?: boolean;
  }): void {
    const { roomName, sanity, description, exits, jumbleSanity = true } =
      options;

    const notices = this.pendingNotices;
    this.pendingNotices = [];

    this.suppressNoticeCapture = true;
    this.terminal.clear();
    this.terminal.setStatus({ room: roomName, sanity });
    this.terminal.setPlaceholder("");
    this.terminal.setBanner(notices);

    this.terminal.print(`— ${roomName} —`, "heading");
    this.terminal.print(`Sanity Level: ${sanity}`, sanity <= 35 ? "alert" : "dim");
    this.terminal.print("", "body");

    // Collapse leftover newlines so "This room contains…" stays one paragraph.
    const prose = description.replace(/\s*\n+\s*/g, " ").replace(/[ \t]+/g, " ").trim();
    if (jumbleSanity) {
      this.terminal.print(this.formatSanityPrompt(prose, sanity), "room");
    } else {
      this.terminal.print(prose, "room");
    }

    this.terminal.print("", "body");
    this.terminal.print("Rooms you can go to:", "system");
    if (exits.length === 0) {
      this.terminal.print("(none)", "dim");
    } else {
      for (const exit of exits) {
        this.terminal.print(exit, "exits");
      }
    }

    this.terminal.print("", "body");
    this.terminal.print(
      "INSPECT · INVENTORY · QUIT",
      "dim",
    );
    this.suppressNoticeCapture = false;
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
    this.terminal.setPlaceholder("Press Enter…");
    while (true) {
      const input = await this.terminal.ask();
      if (input === "" || input === "PICKUP") {
        this.terminal.setPlaceholder("");
        return;
      }
      this.terminal.print(
        "Invalid input, please press Enter key to continue story",
        "dim",
      );
    }
  }

  displayPentacle(candleVal: number): void {
    this.terminal.printPre(pentacleArt(candleVal));
  }

  displayPre(block: string): void {
    this.terminal.printPre(block);
  }

  clear(): void {
    this.pendingNotices = [];
    this.terminal.clearBanner();
    this.terminal.clear();
  }

  sleep(ms: number): Promise<void> {
    return this.terminal.sleep(ms);
  }

  /** Abrupt CRT black cut between room moves. */
  blackout(ms = 230): Promise<void> {
    return this.terminal.blackout(ms);
  }

  /** Invert-pulse flash used with the monster jumpscare. */
  scareFlash(ms = 1550): Promise<void> {
    return this.terminal.scareFlash(ms);
  }

  /** Random-position haunt whisper on the CRT. */
  flashHaunt(text: string): void {
    this.terminal.flashHaunt(text);
  }

  /** Unblock a waiting ask() (sanity game-over / quit). */
  cancelAsk(): void {
    this.terminal.cancelAsk();
  }

  /** Split, jumble non-ALL-CAPS words when sanity is low, rejoin. */
  private formatSanityPrompt(prompt: string, sanity: number): string {
    if (sanity >= 80) {
      return prompt;
    }
    const aggression = this.jumbleAggression(sanity);
    const words = prompt.split(/\s+/).filter((w) => w.length > 0);
    // Subtle early: only a few words twitch. Near 30: almost everything frays.
    const wordChance = 0.06 + aggression * 0.92;
    const jumbled = words.map((word) => {
      if (this.isAllUppercase(word)) {
        return word;
      }
      if (Math.random() > wordChance) {
        return word;
      }
      return this.jumbleWord(word, aggression);
    });
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
   * 0 at sanity 80 (onset), 1 at sanity ≤ 30.
   * Squared so early corruption stays subtle, then ramps hard toward 30.
   */
  private jumbleAggression(sanity: number): number {
    if (sanity >= 80) {
      return 0;
    }
    if (sanity <= 30) {
      return 1;
    }
    const t = (80 - sanity) / 50;
    return t * t;
  }

  /**
   * Gradual sanity corruption: light adjacent swaps at high SAN,
   * heavy middle scrambles as aggression → 1 (near 30).
   */
  private jumbleWord(word: string, aggression: number): string {
    if (aggression <= 0 || word.length <= 2) {
      return word;
    }

    const chars = [...word];

    // Very subtle (SAN ~80–65): rare single adjacent swap in the middle.
    if (aggression < 0.2) {
      if (chars.length > 3 && Math.random() < 0.55) {
        const i = 1 + Math.floor(Math.random() * (chars.length - 3));
        const a = chars[i]!;
        chars[i] = chars[i + 1]!;
        chars[i + 1] = a;
      }
      return chars.join("");
    }

    // Building (SAN ~65–45): a few middle swaps, keep first/last.
    if (aggression < 0.55) {
      const swaps = 1 + Math.floor(aggression * 3);
      for (let n = 0; n < swaps; n++) {
        if (chars.length <= 3) {
          break;
        }
        const i = 1 + Math.floor(Math.random() * (chars.length - 2));
        const j = 1 + Math.floor(Math.random() * (chars.length - 2));
        const a = chars[i]!;
        chars[i] = chars[j]!;
        chars[j] = a;
      }
      return chars.join("");
    }

    // Harsh (SAN ~45–30): shuffle interior; near peak, thrash harder.
    if (chars.length > 2) {
      const mid = chars.slice(1, -1);
      for (let i = mid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = mid[i]!;
        mid[i] = mid[j]!;
        mid[j] = tmp;
      }
      let result = chars[0]! + mid.join("") + chars[chars.length - 1]!;
      if (aggression > 0.85 && result.length > 4) {
        const extra = [...result];
        const numSwaps = Math.max(2, Math.floor(result.length * aggression * 0.7));
        for (let n = 0; n < numSwaps; n++) {
          const i = Math.floor(Math.random() * extra.length);
          const j = Math.floor(Math.random() * extra.length);
          const a = extra[i]!;
          extra[i] = extra[j]!;
          extra[j] = a;
        }
        result = extra.join("");
      }
      return result;
    }

    return chars.join("");
  }
}
