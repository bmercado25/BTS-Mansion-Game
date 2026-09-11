/**
 * Browser port of C++ MonsterClass — setInterval instead of std::thread.
 * Duration 120s; freezes while protected; warns at 15s; triggers grab at 0.
 */

export type MonsterTimerHooks = {
  /** True while inspect/inventory/candle/safe-room protect the player. */
  isProtected: () => boolean;
  /** Non-blocking print (must not call ask). */
  onApproaching: () => void;
  /** Called when timer hits 0 (grab sequence owned by GameController). */
  onTriggered: () => void;
};

export class MonsterTimer {
  private readonly duration: number;
  private readonly hooks: MonsterTimerHooks;
  private timeRemaining: number;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private stopFlag = true;
  private warnedAt15 = false;
  private triggered = false;

  constructor(durationSeconds: number, hooks: MonsterTimerHooks) {
    this.duration = durationSeconds;
    this.timeRemaining = durationSeconds;
    this.hooks = hooks;
  }

  start(): void {
    this.stop();
    this.stopFlag = false;
    this.triggered = false;
    this.warnedAt15 = false;
    this.timeRemaining = this.duration;

    this.timerId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  /** Alias for C++ reset() — restart the full countdown. */
  reset(): void {
    this.start();
  }

  stop(): void {
    this.stopFlag = true;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.timeRemaining = this.duration;
  }

  isTriggered(): boolean {
    return this.triggered;
  }

  getTimeRemaining(): number {
    return this.timeRemaining;
  }

  private tick(): void {
    if (this.stopFlag) {
      return;
    }

    // C++: while protected, sleep but do not decrement.
    if (this.hooks.isProtected()) {
      return;
    }

    this.timeRemaining -= 1;

    if (this.timeRemaining === 15 && !this.warnedAt15) {
      this.warnedAt15 = true;
      this.hooks.onApproaching();
    }

    if (this.timeRemaining <= 0) {
      this.triggered = true;
      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this.hooks.onTriggered();
    }
  }
}

/** ASCII grab art from C++ MonsterClass::onTimerTriggered. */
export const MONSTER_GRAB_ART = [
  "       ___,---.__          /'|`\\          __,---,___",
  "    ,-'    \\`    `-.____,-'  |  `-.____,-'    //    `-.",
  "  ,'        |           ~'\\     /`~           |        `.",
  " /      ___//              `. ,'          ,  , \\___      \\",
  "|    ,-'   `-.__   _         |        ,    __,-'   `-.    |",
  "|   /          /\\_  `   .    |    ,      _/\\          \\   |",
  "\\  |           \\ \\`-.___ \\   |   / ___,-'/ /           |  /",
  " \\  \\           | `._   `\\\\  |  //'   _,' |           /  /",
  "  `-.\\         /'  _ `---'' , . ``---' _  `\\         /,-'",
  "     ``       /     \\    ,='/ \\`=.    /     \\       ''",
  "             |__   /|\\_,--.,-.--,--._/|\\   __|",
  "             /  `./  \\\\`\\ |  |  | /,//' \\,'  \\",
  "           /   /     ||--+--|--+-/-|     \\   \\",
  "           |   |     /'\\_\\_\\ | /_/_/`\\     |   |",
  "            \\   \\__, \\_     `~'     _/ .__/   /",
  "             `-._,-'   `-._______,-'   `-._,-'",
].join("\n");
