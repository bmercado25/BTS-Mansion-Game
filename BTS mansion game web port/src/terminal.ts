/**
 * Browser terminal shell for the BTS Mansion Game web port.
 */

import { gameAudio } from "./audio";

export type LineKind =
  | "body"
  | "echo"
  | "dim"
  | "heading"
  | "room"
  | "exits"
  | "system"
  | "alert"
  | "divider";

export type StatusInfo = {
  room?: string;
  sanity?: number | null;
};

export type BannerLine = {
  text: string;
  kind?: LineKind;
};

export type Terminal = {
  print: (line: string, kind?: LineKind) => void;
  printPre: (block: string) => void;
  clear: () => void;
  ask: (prompt?: string) => Promise<string>;
  cancelAsk: () => void;
  sleep: (ms: number) => Promise<void>;
  setPlaceholder: (text: string) => void;
  setStatus: (info: StatusInfo) => void;
  setBanner: (lines: BannerLine[]) => void;
  clearBanner: () => void;
  /** Hard black cut across the CRT — short, uncomfortable room transition. */
  blackout: (ms?: number) => Promise<void>;
  /** Invert-pulse flash for jumpscare (skips motion if reduced-motion). */
  scareFlash: (ms?: number) => Promise<void>;
};

type PendingAsk = {
  resolve: (value: string) => void;
};

const KIND_CLASS: Record<LineKind, string> = {
  body: "terminal-line",
  echo: "terminal-line is-echo",
  dim: "terminal-line is-dim",
  heading: "terminal-line is-heading",
  room: "terminal-line is-room",
  exits: "terminal-line is-exits",
  system: "terminal-line is-system",
  alert: "terminal-line is-alert",
  divider: "terminal-line is-divider",
};

export function createTerminal(root: HTMLElement): Terminal {
  const output = root.querySelector<HTMLElement>("#output");
  const form = root.querySelector<HTMLFormElement>("#input-form");
  const input = root.querySelector<HTMLInputElement>("#command-input");
  const caret = root.querySelector<HTMLElement>(".terminal-caret");
  const banner = root.querySelector<HTMLElement>("#terminal-banner");
  const blackoutEl = root.querySelector<HTMLElement>("#terminal-blackout");
  const statusRoom = document.querySelector<HTMLElement>("#status-room");
  const statusSanity = document.querySelector<HTMLElement>("#status-sanity");

  if (!output || !form || !input) {
    throw new Error("Terminal markup missing (#output, #input-form, #command-input).");
  }

  let pending: PendingAsk | null = null;
  let caretCanvas: HTMLCanvasElement | null = null;

  const syncCaret = (): void => {
    if (!caret) {
      return;
    }
    const style = window.getComputedStyle(input);
    const padLeft = Number.parseFloat(style.paddingLeft) || 0;
    const pos = input.selectionStart ?? input.value.length;
    const before = input.value.slice(0, pos);

    if (!caretCanvas) {
      caretCanvas = document.createElement("canvas");
    }
    const ctx = caretCanvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    // Canvas ignores CSS letter-spacing; VT323 is monospace so advance is stable.
    const textWidth = before.length === 0 ? 0 : ctx.measureText(before).width;
    const x = Math.max(0, padLeft + textWidth - input.scrollLeft);
    caret.style.transform = `translateX(${x}px)`;
  };

  const scrollToBottom = () => {
    output.scrollTop = output.scrollHeight;
  };

  const print = (line: string, kind: LineKind = "body"): void => {
    const row = document.createElement("div");
    row.className = KIND_CLASS[kind];
    if (kind === "divider") {
      row.textContent = line.length > 0 ? line : "--------------------------------";
    } else {
      row.textContent = line.length === 0 ? " " : line;
    }
    output.appendChild(row);
    scrollToBottom();
  };

  const printPre = (block: string): void => {
    const pre = document.createElement("pre");
    pre.className = "terminal-pre";
    pre.textContent = block;
    output.appendChild(pre);
    scrollToBottom();
  };

  const clearBanner = (): void => {
    if (!banner) {
      return;
    }
    banner.replaceChildren();
    banner.hidden = true;
  };

  const setBanner = (lines: BannerLine[]): void => {
    if (!banner) {
      return;
    }
    banner.replaceChildren();
    const usable = lines.filter(
      (line) => line.kind !== "divider" && line.text.trim().length > 0,
    );
    if (usable.length === 0) {
      banner.hidden = true;
      return;
    }

    const label = document.createElement("div");
    label.className = "terminal-banner-label";
    label.textContent = "EVENT";
    banner.appendChild(label);

    for (const line of usable) {
      const row = document.createElement("div");
      row.className = `terminal-banner-line ${KIND_CLASS[line.kind ?? "system"]}`;
      row.textContent = line.text;
      banner.appendChild(row);
    }
    banner.hidden = false;
    // Prefer the latest event text (interact results, unlocks) over leading inventory lists.
    banner.scrollTop = banner.scrollHeight;
    requestAnimationFrame(() => {
      banner.scrollTop = banner.scrollHeight;
    });
  };

  const clear = (): void => {
    output.replaceChildren();
  };

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

  const blackout = async (ms = 230): Promise<void> => {
    if (!blackoutEl) {
      await sleep(ms);
      return;
    }
    blackoutEl.hidden = false;
    // Force paint before holding black so the cut is visible.
    void blackoutEl.offsetHeight;
    await sleep(ms);
    blackoutEl.hidden = true;
  };

  const scareFlash = async (ms = 1550): Promise<void> => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      root.classList.add("is-scare-flash");
      await sleep(Math.min(ms, 400));
      root.classList.remove("is-scare-flash");
      return;
    }
    root.classList.remove("is-scare-flash");
    // Retrigger animation if called again quickly.
    void root.offsetWidth;
    root.classList.add("is-scare-flash");
    await sleep(ms);
    root.classList.remove("is-scare-flash");
  };

  const setPlaceholder = (text: string): void => {
    input.placeholder = text;
  };

  const setStatus = (info: StatusInfo): void => {
    if (statusRoom && info.room !== undefined) {
      statusRoom.textContent = info.room || "—";
    }
    if (statusSanity && info.sanity !== undefined) {
      if (info.sanity === null) {
        statusSanity.textContent = "—";
        statusSanity.dataset.level = "idle";
      } else {
        statusSanity.textContent = String(info.sanity);
        if (info.sanity <= 20) {
          statusSanity.dataset.level = "critical";
        } else if (info.sanity <= 35) {
          statusSanity.dataset.level = "low";
        } else {
          statusSanity.dataset.level = "ok";
        }
      }
    }
  };

  const ask = (prompt?: string): Promise<string> => {
    if (pending) {
      throw new Error("ask() called while another ask() is already waiting.");
    }

    if (prompt !== undefined && prompt !== "") {
      print(prompt, "system");
    }

    input.focus();

    return new Promise<string>((resolve) => {
      pending = { resolve };
    });
  };

  const cancelAsk = (): void => {
    if (!pending) {
      return;
    }
    const current = pending;
    pending = null;
    current.resolve("");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    gameAudio.playEnterBeep();

    const raw = input.value;
    const trimmed = raw.trim();
    input.value = "";
    syncCaret();

    if (raw.length > 0) {
      print(`» ${raw}`, "echo");
    }

    if (!pending) {
      return;
    }

    const current = pending;
    pending = null;
    current.resolve(trimmed);
  });

  root.addEventListener("click", () => {
    input.focus();
  });

  for (const eventName of ["input", "keydown", "keyup", "click", "select", "focus"] as const) {
    input.addEventListener(eventName, () => {
      // keydown needs a frame so selectionStart is updated for arrows.
      window.requestAnimationFrame(syncCaret);
    });
  }

  setPlaceholder("");
  setStatus({ room: "MENU", sanity: null });
  input.focus();
  syncCaret();

  clearBanner();

  return {
    print,
    printPre,
    clear,
    ask,
    cancelAsk,
    sleep,
    setPlaceholder,
    setStatus,
    setBanner,
    clearBanner,
    blackout,
    scareFlash,
  };
}
