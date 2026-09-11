/**
 * Browser terminal shell API for the BTS Mansion Game web port.
 * Later phases (UI adapter / game loop) should build on these primitives.
 */

export type Terminal = {
  print: (line: string) => void;
  clear: () => void;
  ask: (prompt?: string) => Promise<string>;
  sleep: (ms: number) => Promise<void>;
};

type PendingAsk = {
  resolve: (value: string) => void;
};

export function createTerminal(root: HTMLElement): Terminal {
  const output = root.querySelector<HTMLElement>("#output");
  const form = root.querySelector<HTMLFormElement>("#input-form");
  const input = root.querySelector<HTMLInputElement>("#command-input");

  if (!output || !form || !input) {
    throw new Error("Terminal markup missing (#output, #input-form, #command-input).");
  }

  let pending: PendingAsk | null = null;

  const scrollToBottom = () => {
    output.scrollTop = output.scrollHeight;
  };

  const print = (line: string): void => {
    const row = document.createElement("div");
    row.className = "terminal-line";
    row.textContent = line;
    output.appendChild(row);
    scrollToBottom();
  };

  const clear = (): void => {
    output.replaceChildren();
  };

  const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

  const ask = (prompt?: string): Promise<string> => {
    if (pending) {
      throw new Error("ask() called while another ask() is already waiting.");
    }

    if (prompt !== undefined && prompt !== "") {
      print(prompt);
    }

    input.focus();

    return new Promise<string>((resolve) => {
      pending = { resolve };
    });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raw = input.value;
    const trimmed = raw.trim();
    input.value = "";

    print(`» ${raw}`);

    if (!pending) {
      return;
    }

    const current = pending;
    pending = null;
    current.resolve(trimmed);
  });

  // Click anywhere on the terminal to focus input.
  root.addEventListener("click", () => {
    input.focus();
  });

  input.focus();

  return { print, clear, ask, sleep };
}
