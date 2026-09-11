import type { UserInterface } from "./userInterface";
import type { InteractionHook } from "./domain/item";

export type MessageInteractResult = "interacted" | "walked-away";

/**
 * Browser port of C++ InteractClass — non-puzzle path (runInteraction).
 * Puzzle runners stay stubbed in GameController until Phase 7.
 */
export class Interact {
  private readonly ui: UserInterface;
  private inputMessage: string;
  private interactMessage: string;
  private interacted = false;

  constructor(ui: UserInterface, inputMessage = "", interactMessage = "") {
    this.ui = ui;
    this.inputMessage = inputMessage;
    this.interactMessage = interactMessage;
  }

  static fromHook(ui: UserInterface, hook: InteractionHook): Interact {
    return new Interact(ui, hook.inputMessage ?? "", hook.outputMessage ?? "");
  }

  setInputMessage(message: string): void {
    this.inputMessage = message;
  }

  setOutputMessage(message: string): void {
    this.interactMessage = message;
  }

  getInputMessage(): string {
    return this.inputMessage;
  }

  getInteractMessage(): string {
    return this.interactMessage;
  }

  hasInteracted(): boolean {
    return this.interacted;
  }

  /**
   * Non-puzzle flow matching C++ InteractClass::runInteraction():
   * show inputMessage → "Enter action (INTERACT): " → INTERACT prints interactMessage.
   */
  async runMessageInteraction(): Promise<MessageInteractResult> {
    this.ui.displayPrompt(this.inputMessage);
    this.ui.displayPrompt("Enter action (INTERACT): ");
    const action = (await this.ui.userInput()).trim().toUpperCase();

    if (action === "INTERACT") {
      this.displayDescription();
      this.interacted = true;
      return "interacted";
    }

    this.ui.displayPrompt("You walk away.");
    return "walked-away";
  }

  /** Port of displayDescription() — prints interactMessage (may be multiline). */
  displayDescription(): void {
    const message = this.interactMessage;
    if (message === "") {
      this.ui.displayPrompt("");
      return;
    }
    for (const line of message.split("\n")) {
      this.ui.displayPrompt(line);
    }
  }
}
