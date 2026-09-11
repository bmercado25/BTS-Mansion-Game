import type { UserInterface } from "../userInterface";
import type { Player } from "./player";
import type { Room } from "./room";

/** Print room description, items, and exits through the UI adapter. */
export function presentRoom(ui: UserInterface, room: Room): void {
  ui.displayLine(`Room: ${room.getName()}`, "heading");
  ui.displayLine(room.getDescription(), "room");
  ui.displayLine("");
  presentRoomItems(ui, room);
  ui.displayLine("");
  presentExits(ui, room);
}

export function presentRoomItems(ui: UserInterface, room: Room): void {
  ui.displayLine("-----------", "divider");
  ui.displayLine("Items inside this room are:", "system");
  ui.displayLine("");
  const names = room.listItemNames();
  if (names.length === 0) {
    ui.displayLine("(none)", "dim");
    return;
  }
  for (const name of names) {
    ui.displayLine(name, "exits");
  }
}

export function presentExits(ui: UserInterface, room: Room): void {
  ui.displayLine("Rooms you can go to:", "system");
  ui.displayLine("");
  const exits = room.listExits();
  if (exits.length === 0) {
    ui.displayLine("(none)", "dim");
    return;
  }
  for (const exit of exits) {
    ui.displayLine(exit, "exits");
  }
}

export function presentInventory(ui: UserInterface, player: Player): void {
  ui.displayLine("Inventory:", "heading");
  ui.displayLine("");
  const names = player.listInventoryNames();
  if (names.length === 0) {
    ui.displayLine("(empty)", "dim");
    return;
  }
  for (const name of names) {
    ui.displayLine(name, "exits");
  }
}

export function presentPlayerStatus(ui: UserInterface, player: Player): void {
  ui.displayLine(`Sanity: ${player.getSanity()}`, "system");
  ui.displayLine(`Candles: ${player.getCandles()}`, "dim");
  ui.displayLine(`Current room: ${player.getRoomName() || "(none)"}`, "dim");
}
