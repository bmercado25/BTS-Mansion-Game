import type { UserInterface } from "../userInterface";
import { Door, Item, PickUpItem, Player, Room, presentInventory, presentPlayerStatus, presentRoom } from "./index";

/**
 * Tiny Phase 3 smoke demo: one room, one item, one player — all output via UI.
 * Gated from the menu as DEMO (or ?demo=domain).
 */
export async function runDomainSmokeDemo(ui: UserInterface): Promise<void> {
  ui.clear();
  ui.displayPrompt("=== Domain smoke demo (Phase 3) ===");
  ui.displayPrompt("");

  const rustyKey = Item.key(
    "RUSTY KEY",
    "a RUSTY KEY that looks like it might fit an old lock",
    "BBBB",
  );

  const foyer = new Room({
    description:
      "You enter the foyer. Faded wallpaper, grim portraits, and a chill in the air.",
    name: "FOYER",
    exits: ["LOUNGE", "DOOR"],
    doors: [
      new Door(
        true,
        "BBBB",
        "The ornate wooden DOOR swings open into the library beyond.",
        "DOOR",
      ),
    ],
    items: [rustyKey],
  });

  const player = new Player(foyer);

  presentRoom(ui, foyer);
  ui.displayPrompt("");
  presentPlayerStatus(ui, player);
  ui.displayPrompt("");

  ui.displayPrompt("Picking up RUSTY KEY...");
  const fromRoom = foyer.removeItemByName("RUSTY KEY");
  if (fromRoom) {
    const pickup = new PickUpItem(fromRoom);
    pickup.addToInventory(player);
  }

  ui.displayPrompt("");
  presentRoomItemsAfterPickup(ui, foyer);
  ui.displayPrompt("");
  presentInventory(ui, player);
  ui.displayPrompt("");
  ui.displayPrompt(`Has RUSTY KEY? ${player.inInventory("RUSTY KEY") ? "yes" : "no"}`);
  ui.displayPrompt(`Key search BBBB → ${player.searchForKey("BBBB")}`);
  ui.displayPrompt("");
  ui.displayPrompt("Press Enter to return to the menu.");
  await ui.waitForInput();
}

function presentRoomItemsAfterPickup(ui: UserInterface, room: Room): void {
  ui.displayPrompt("Items left in room:");
  const names = room.listItemNames();
  if (names.length === 0) {
    ui.displayPrompt("(none)");
    return;
  }
  for (const name of names) {
    ui.displayPrompt(name);
  }
}
