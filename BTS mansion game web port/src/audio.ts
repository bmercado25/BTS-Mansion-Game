/**
 * Browser adaptation of C++ PlaySound hooks.
 * Fails soft when autoplay is blocked; unlocks after first user gesture.
 */

export type SfxId =
  | "generalPickup"
  | "paperPickup"
  | "keySound"
  | "pillBottle"
  | "doorUnlock"
  | "doorOpen"
  | "bookshelfOpen"
  | "holyWaterPour"
  | "safeOpening"
  | "monsterCandleRoar"
  | "tunnelOpening"
  | "portalOpening"
  | "teleportUpstairs"
  | "walkDownStairs"
  | "walkingThroughTunnel"
  | "jumpscare"
  | "puzzleSuccess";

const SFX_FILES: Record<SfxId, string> = {
  generalPickup: "general-pickup.wav",
  paperPickup: "paper-pickup.wav",
  keySound: "key-sound.wav",
  pillBottle: "pill-bottle.wav",
  doorUnlock: "door-unlock.wav",
  doorOpen: "door-open.wav",
  bookshelfOpen: "bookshelf-open.wav",
  holyWaterPour: "holy-water-pour.wav",
  safeOpening: "safe-opening.wav",
  monsterCandleRoar: "monster-candle-roar.wav",
  tunnelOpening: "tunnel-opening.wav",
  portalOpening: "portal-opening.wav",
  teleportUpstairs: "teleport-upstairs.wav",
  walkDownStairs: "walk-down-stairs.wav",
  walkingThroughTunnel: "walking-through-tunnel.wav",
  jumpscare: "jumpscare.wav",
  puzzleSuccess: "puzzle-success.wav",
};

const MUTE_STORAGE_KEY = "bts-mansion-audio-muted";

export class GameAudio {
  private muted = false;
  private unlocked = false;
  private readonly basePath: string;
  private readonly cache = new Map<SfxId, HTMLAudioElement>();

  constructor(basePath = "/audio/") {
    this.basePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
    this.muted = localStorage.getItem(MUTE_STORAGE_KEY) === "1";
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
    if (muted) {
      for (const audio of this.cache.values()) {
        audio.pause();
      }
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Call from a user gesture (input / click) so later plays are allowed. */
  unlock(): void {
    if (this.unlocked) {
      return;
    }
    this.unlocked = true;
    // Warm one silent play attempt so the browser marks the context as user-activated.
    const probe = new Audio(`${this.basePath}${SFX_FILES.generalPickup}`);
    probe.volume = 0;
    void probe.play().then(
      () => {
        probe.pause();
      },
      () => {
        /* autoplay still blocked — later plays will retry */
      },
    );
  }

  /** Fire-and-forget SFX; never throws. */
  play(id: SfxId): void {
    if (this.muted) {
      return;
    }
    try {
      let audio = this.cache.get(id);
      if (!audio) {
        audio = new Audio(`${this.basePath}${SFX_FILES[id]}`);
        audio.preload = "auto";
        this.cache.set(id, audio);
      }
      audio.currentTime = 0;
      void audio.play().catch(() => {
        /* Autoplay policy / missing file — fail soft */
      });
    } catch {
      /* ignore */
    }
  }

  /** Infer pickup SFX from item name (C++ item soundFileName defaults). */
  playPickupFor(itemName: string): void {
    const name = itemName.toUpperCase();
    if (name.includes("KEY")) {
      this.play("keySound");
      return;
    }
    if (
      name.includes("NOTE") ||
      name.includes("JOURNAL") ||
      name.includes("NEWSPAPER") ||
      name.includes("CLIPPING") ||
      name === "STORYBOOK"
    ) {
      this.play("paperPickup");
      return;
    }
    this.play("generalPickup");
  }

  /**
   * Room-transition SFX matching GameController movement branches.
   */
  playMovement(previousRoom: string, command: string): void {
    if (command === "PORTAL" || command === "BOOKSHELF") {
      return;
    }
    if (command === "HIDDEN SECTION") {
      this.play("walkDownStairs");
      return;
    }
    if (command === "LIBRARY" && previousRoom === "HIDDEN SECTION") {
      this.play("walkDownStairs");
      return;
    }
    if (command === "KITCHEN" && previousRoom === "RITUAL ROOM") {
      this.play("walkingThroughTunnel");
      return;
    }
    if (
      command === "HEDGE MAZE EXIT" ||
      (command === "HEDGE MAZE" &&
        (previousRoom === "HEDGE MAZE EXIT" || previousRoom === "GARDEN"))
    ) {
      this.play("walkingThroughTunnel");
      return;
    }
    if (
      command === "FOUNTAIN" ||
      command === "GRAVEYARD" ||
      command === "GARDEN"
    ) {
      this.play("walkingThroughTunnel");
      return;
    }
    if (command === "THE LIFT") {
      this.play("portalOpening");
      return;
    }
    if (command === "MEMORY OF THE MANSION" && previousRoom === "THE LIFT") {
      this.play("portalOpening");
      return;
    }
    this.play("doorOpen");
  }

  /** Door unlock SFX by door command name. */
  playDoorUnlock(command: string): void {
    if (command === "BOOKSHELF") {
      this.play("bookshelfOpen");
      return;
    }
    if (
      command === "BLOCKED HEDGE MAZE" ||
      command === "HEDGE MAZE" ||
      command === "MAZE EXIT"
    ) {
      this.play("holyWaterPour");
      return;
    }
    this.play("doorUnlock");
  }
}

/** Shared singleton for the web port. */
export const gameAudio = new GameAudio();
