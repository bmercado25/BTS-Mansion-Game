/**
 * Browser adaptation of C++ PlaySound hooks.
 * Preloads on unlock; clones for low-latency playback. Fails soft if blocked.
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
const VOLUME_STORAGE_KEY = "bts-mansion-audio-volume-v2";

type AmbientKind = "hum" | "drone";

function clampVolume(value: number): number {
  if (Number.isNaN(value)) {
    return 1;
  }
  return Math.min(1, Math.max(0, value));
}

export class GameAudio {
  private muted = false;
  private volume = 1;
  private unlocked = false;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  /** What ambient should be playing when unmuted. */
  private desiredAmbient: AmbientKind | "none" = "hum";
  private ambientKind: AmbientKind | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSources: AudioScheduledSourceNode[] = [];
  private readonly basePath: string;
  /** Decoded templates — clone on play so SFX start immediately. */
  private readonly templates = new Map<SfxId, HTMLAudioElement>();

  constructor(basePath = "/audio/") {
    this.basePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
    this.muted = localStorage.getItem(MUTE_STORAGE_KEY) === "1";
    const storedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
    this.volume = storedVolume === null ? 1 : clampVolume(Number(storedVolume));
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /** All synthesized audio routes through this so the slider applies. */
  private getMasterGain(): GainNode {
    const ctx = this.getAudioContext();
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.connect(ctx.destination);
    }
    this.applyMasterVolume();
    return this.masterGain;
  }

  private applyMasterVolume(): void {
    if (!this.masterGain) {
      return;
    }
    this.masterGain.gain.value = this.muted ? 0 : this.volume;
  }

  private sfxVolume(): number {
    return this.muted ? 0 : this.volume;
  }

  isMuted(): boolean {
    return this.muted;
  }

  getVolume(): number {
    return this.volume;
  }

  setVolume(volume: number): void {
    this.volume = clampVolume(volume);
    localStorage.setItem(VOLUME_STORAGE_KEY, String(this.volume));
    this.applyMasterVolume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(MUTE_STORAGE_KEY, muted ? "1" : "0");
    this.applyMasterVolume();
    this.syncAmbient();
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /** Call from a user gesture so playback is allowed, then preload all SFX. */
  unlock(): void {
    if (this.unlocked) {
      void this.audioCtx?.resume();
      this.syncAmbient();
      return;
    }
    this.unlocked = true;
    this.preloadAll();
    if (this.desiredAmbient === "none") {
      this.desiredAmbient = "hum";
    }
    this.syncAmbient();
  }

  /** Menu: CRT / PSU computer hum. */
  enterMenu(): void {
    this.desiredAmbient = "hum";
    this.syncAmbient();
  }

  /**
   * Game start: kill the menu hum, weird error beep, then low horror drone.
   */
  async enterGameplay(): Promise<void> {
    this.desiredAmbient = "drone";
    this.stopAmbientLoop(0.15);
    await this.playErrorBeep();
    this.syncAmbient();
  }

  private syncAmbient(): void {
    if (!this.unlocked || this.muted || this.desiredAmbient === "none") {
      this.stopAmbientLoop();
      return;
    }
    if (this.ambientKind === this.desiredAmbient) {
      return;
    }
    this.stopAmbientLoop(0.2);
    if (this.desiredAmbient === "hum") {
      this.startHumLoop();
    } else {
      this.startDroneLoop();
    }
  }

  private stopAmbientLoop(fadeSec = 0.4): void {
    if (!this.ambientKind) {
      return;
    }
    const gain = this.ambientGain;
    const sources = this.ambientSources;
    const ctx = this.audioCtx;
    this.ambientKind = null;
    this.ambientGain = null;
    this.ambientSources = [];

    try {
      if (ctx && gain) {
        const now = ctx.currentTime;
        const fade = Math.max(0.05, fadeSec);
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
        window.setTimeout(
          () => {
            for (const src of sources) {
              try {
                src.stop();
                src.disconnect();
              } catch {
                /* already stopped */
              }
            }
            try {
              gain.disconnect();
            } catch {
              /* ignore */
            }
          },
          fade * 1000 + 50,
        );
      } else {
        for (const src of sources) {
          try {
            src.stop();
            src.disconnect();
          } catch {
            /* ignore */
          }
        }
      }
    } catch {
      /* ignore */
    }
  }

  /** Soft electrical PSU / CRT coil hum for the menu. */
  private startHumLoop(): void {
    if (this.muted) {
      return;
    }
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(420, now);
      filter.Q.setValueAtTime(0.6, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.05, now + 1.2);

      const sources: AudioScheduledSourceNode[] = [];

      // 60 / 120 Hz mains + faint coil whine
      const humPartials: Array<{
        freq: number;
        type: OscillatorType;
        level: number;
      }> = [
        { freq: 60, type: "sine", level: 1 },
        { freq: 120, type: "sine", level: 0.55 },
        { freq: 180, type: "triangle", level: 0.18 },
        { freq: 240, type: "sine", level: 0.08 },
      ];

      for (const partial of humPartials) {
        const osc = ctx.createOscillator();
        const partialGain = ctx.createGain();
        osc.type = partial.type;
        osc.frequency.setValueAtTime(partial.freq, now);
        partialGain.gain.setValueAtTime(partial.level, now);
        osc.connect(partialGain);
        partialGain.connect(filter);
        osc.start(now);
        sources.push(osc);
      }

      // Soft fan-ish noise bed
      const noiseLen = Math.floor(ctx.sampleRate * 2);
      const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(220, now);
      noiseFilter.Q.setValueAtTime(0.8, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.09, now);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(filter);
      noise.start(now);
      sources.push(noise);

      filter.connect(gain);
      gain.connect(this.getMasterGain());

      this.ambientGain = gain;
      this.ambientSources = sources;
      this.ambientKind = "hum";
    } catch {
      this.ambientGain = null;
      this.ambientSources = [];
      this.ambientKind = null;
    }
  }

  /** Quiet looping sub-drone once the game has started. */
  private startDroneLoop(): void {
    if (this.muted) {
      return;
    }
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(110, now);
      filter.Q.setValueAtTime(0.7, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 2.5);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.07, now);
      lfoGain.gain.setValueAtTime(0.016, now);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      const freqs = [41, 41.35, 61.5] as const;
      const types: OscillatorType[] = ["sine", "sine", "triangle"];
      const sources: AudioScheduledSourceNode[] = [];

      for (let i = 0; i < freqs.length; i++) {
        const osc = ctx.createOscillator();
        osc.type = types[i];
        osc.frequency.setValueAtTime(freqs[i], now);
        const partial = ctx.createGain();
        partial.gain.setValueAtTime(i === 2 ? 0.35 : 1, now);
        osc.connect(partial);
        partial.connect(filter);
        osc.start(now);
        sources.push(osc);
      }

      filter.connect(gain);
      gain.connect(this.getMasterGain());
      lfo.start(now);
      sources.push(lfo);

      this.ambientGain = gain;
      this.ambientSources = sources;
      this.ambientKind = "drone";
    } catch {
      this.ambientGain = null;
      this.ambientSources = [];
      this.ambientKind = null;
    }
  }

  /** Broken-terminal error sting before the horror drone. */
  playErrorBeep(): Promise<void> {
    const totalMs = 1100;
    if (this.muted) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, 120);
      });
    }
    try {
      // Don't call unlock() — it would syncAmbient and start the drone mid-beep.
      if (!this.unlocked) {
        this.unlocked = true;
        this.preloadAll();
      }
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.18, now);
      master.connect(this.getMasterGain());

      const blip = (
        start: number,
        freq: number,
        dur: number,
        type: OscillatorType = "square",
        level = 1,
      ) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + start);
        f.type = "lowpass";
        f.frequency.setValueAtTime(2200, now + start);
        g.gain.setValueAtTime(0.0001, now + start);
        g.gain.exponentialRampToValueAtTime(level, now + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(f);
        f.connect(g);
        g.connect(master);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.04);
      };

      // One long dissonant fault buzz
      blip(0, 152, 0.95, "sawtooth", 0.95);
      blip(0.02, 161, 0.95, "square", 0.85);
      blip(0.05, 304, 0.9, "triangle", 0.35);
    } catch {
      /* ignore */
    }
    return new Promise((resolve) => {
      window.setTimeout(resolve, totalMs);
    });
  }

  private urlFor(id: SfxId): string {
    return `${this.basePath}${SFX_FILES[id]}`;
  }

  private ensureTemplate(id: SfxId): HTMLAudioElement {
    let audio = this.templates.get(id);
    if (!audio) {
      audio = new Audio(this.urlFor(id));
      audio.preload = "auto";
      this.templates.set(id, audio);
    }
    return audio;
  }

  private preloadAll(): void {
    for (const id of Object.keys(SFX_FILES) as SfxId[]) {
      const audio = this.ensureTemplate(id);
      try {
        audio.load();
      } catch {
        /* ignore */
      }
    }
    // Silent prime so the first real SFX isn't gated on the gesture buffer.
    const probe = this.ensureTemplate("generalPickup").cloneNode(
      true,
    ) as HTMLAudioElement;
    probe.volume = 0;
    void probe.play().then(
      () => {
        probe.pause();
      },
      () => {
        /* still blocked — later plays retry */
      },
    );
  }

  /** Fire-and-forget SFX; never throws. */
  play(id: SfxId): void {
    if (this.muted) {
      return;
    }
    try {
      if (!this.unlocked) {
        this.unlock();
      }
      const template = this.ensureTemplate(id);
      const clip = template.cloneNode(true) as HTMLAudioElement;
      clip.volume = this.sfxVolume();
      clip.currentTime = 0;
      void clip.play().catch(() => {
        /* Autoplay / decode — fail soft */
      });
    } catch {
      /* ignore */
    }
  }

  /** Low analog terminal beep on Enter — synthesized, fails soft. */
  playEnterBeep(): void {
    if (this.muted) {
      return;
    }
    try {
      if (!this.unlocked) {
        this.unlock();
      }
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 0.2;

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      oscA.type = "square";
      oscB.type = "triangle";
      oscA.frequency.setValueAtTime(108, now);
      oscA.frequency.exponentialRampToValueAtTime(68, now + duration);
      oscB.frequency.setValueAtTime(111.5, now);
      oscB.frequency.exponentialRampToValueAtTime(70, now + duration);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, now);
      filter.frequency.exponentialRampToValueAtTime(160, now + duration);
      filter.Q.setValueAtTime(1.4, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.11, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(gain);
      gain.connect(this.getMasterGain());

      oscA.start(now);
      oscB.start(now);
      oscA.stop(now + duration + 0.02);
      oscB.stop(now + duration + 0.02);
    } catch {
      /* ignore */
    }
  }

  /**
   * Urgent approaching-monster alert — same family as Enter beep, but sharper
   * and doubled so it reads as a warning, not a keypress.
   */
  playMonsterWarnBeep(): void {
    if (this.muted) {
      return;
    }
    try {
      if (!this.unlocked) {
        this.unlock();
      }
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.13, now);
      master.connect(this.getMasterGain());

      const pulse = (start: number, fromHz: number, toHz: number, dur: number) => {
        const oscA = ctx.createOscillator();
        const oscB = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        oscA.type = "square";
        oscB.type = "sawtooth";
        oscA.frequency.setValueAtTime(fromHz, now + start);
        oscA.frequency.exponentialRampToValueAtTime(toHz, now + start + dur);
        oscB.frequency.setValueAtTime(fromHz * 1.04, now + start);
        oscB.frequency.exponentialRampToValueAtTime(
          toHz * 1.03,
          now + start + dur,
        );

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(720, now + start);
        filter.Q.setValueAtTime(2.2, now + start);

        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(1, now + start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

        oscA.connect(filter);
        oscB.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        oscA.start(now + start);
        oscB.start(now + start);
        oscA.stop(now + start + dur + 0.03);
        oscB.stop(now + start + dur + 0.03);
      };

      // Two rising sour pulses — concerning, not the soft Enter thud.
      pulse(0, 220, 310, 0.16);
      pulse(0.22, 240, 360, 0.2);
    } catch {
      /* ignore */
    }
  }

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

export const gameAudio = new GameAudio();
