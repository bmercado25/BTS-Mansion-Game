import type { UserInterface } from "../userInterface";
import type { Player } from "./player";
import type { Room } from "./room";

/** Print room description, items, and exits through the UI adapter. */
export function presentRoom(ui: UserInterface, room: Room): void {
  ui.displayPrompt(`Room: ${room.getName()}`);
  ui.displayPrompt(room.getDescription());
  ui.displayPrompt("");
  presentRoomItems(ui, room);
  ui.displayPrompt("");
  presentExits(ui, room);
}

export function presentRoomItems(ui: UserInterface, room: Room): void {
  ui.displayPrompt("-----------");
  ui.displayPrompt("Items inside this room are:");
  ui.displayPrompt("");
  const names = room.listItemNames();
  if (names.length === 0) {
    ui.displayPrompt("(none)");
    return;
  }
  for (const name of names) {
    ui.displayPrompt(name);
  }
}

export function presentExits(ui: UserInterface, room: Room): void {
  ui.displayPrompt("Rooms you can go to:");
  ui.displayPrompt("");
  const exits = room.listExits();
  if (exits.length === 0) {
    ui.displayPrompt("(none)");
    return;
  }
  for (const exit of exits) {
    ui.displayPrompt(exit);
  }
}

export function presentInventory(ui: UserInterface, player: Player): void {
  ui.displayPrompt("Inventory:");
  ui.displayPrompt("");
  const names = player.listInventoryNames();
  if (names.length === 0) {
    ui.displayPrompt("(empty)");
    return;
  }
  for (const name of names) {
    ui.displayPrompt(name);
  }
}

export function presentPlayerStatus(ui: UserInterface, player: Player): void {
  ui.displayPrompt(`Sanity: ${player.getSanity()}`);
  ui.displayPrompt(`Candles: ${player.getCandles()}`);
  ui.displayPrompt(`Current room: ${player.getRoomName() || "(none)"}`);
}
