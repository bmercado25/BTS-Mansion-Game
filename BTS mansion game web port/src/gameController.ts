import type { UserInterface } from "./userInterface";
import {
  Door,
  Item,
  PickUpItem,
  Player,
  Room,
  presentExits,
  presentInventory,
  presentRoomItems,
} from "./domain";

/**
 * Minimal GameController-style loop (Phase 4).
 * Tiny world: FOYER ↔ LOUNGE, locked DOOR → LIBRARY.
 */
export class GameController {
  private readonly ui: UserInterface;
  private rooms = new Map<string, Room>();
  private player: Player | null = null;
  private running = false;

  constructor(ui: UserInterface) {
    this.ui = ui;
  }

  async startGame(): Promise<void> {
    this.buildMiniWorld();
    const foyer = this.rooms.get("FOYER");
    if (!foyer) {
      throw new Error("FOYER missing from mini world.");
    }

    this.player = new Player(foyer);
    this.running = true;

    this.ui.clear();
    this.ui.displayPrompt("You wake in a dim foyer. Something is wrong with this place.");
    this.ui.displayPrompt(
      "INSTRUCTIONS: Any word in ALL CAPS (INSPECT, PICKUP, LOUNGE, DOOR, …) is a command.",
    );
    this.ui.displayPrompt("");

    await this.gameLoop();
  }

  endGame(): void {
    this.running = false;
    this.ui.clear();
    this.ui.displayPrompt(
      "Your world disappears around you. You are still aware but there is nothing,",
    );
    this.ui.displayPrompt("like someone pulled the plug on your brain - Am I dead?");
    this.ui.displayPrompt("...You wonder if this will end.");
    this.ui.displayPrompt("Thank you for playing");
  }

  private buildMiniWorld(): void {
    this.rooms.clear();

    const rustyKey = Item.key(
      "RUSTY KEY",
      "a RUSTY KEY that looks like it might fit an old lock",
      "BBBB",
    );

    const libraryDoor = new Door(
      true,
      "BBBB",
      "The ornate wooden DOOR stands open. Beyond it, the LIBRARY waits.",
      "DOOR",
    );

    const foyer = new Room({
      description:
        "You enter the foyer. Faded wallpaper, grim portraits, and a chill in the air. There appears to be an ornate wooden DOOR that is locked.",
      name: "FOYER",
      exits: ["LOUNGE", "DOOR"],
      doors: [libraryDoor],
      items: [],
    });

    const lounge = new Room({
      description:
        "You enter the lounge. A staircase is blocked by black sludge. Something metallic glints nearby.",
      name: "LOUNGE",
      exits: ["FOYER"],
      items: [rustyKey],
    });

    const library = new Room({
      description: "You enter the library, filled to the brim with bookshelves.",
      name: "LIBRARY",
      exits: ["FOYER"],
      items: [],
    });

    this.rooms.set("FOYER", foyer);
    this.rooms.set("LOUNGE", lounge);
    this.rooms.set("LIBRARY", library);
  }

  private async gameLoop(): Promise<void> {
    if (!this.player) {
      return;
    }

    while (this.running) {
      const player = this.player;
      const currentRoom = player.getRoom();

      this.ui.displayPrompt("");
      this.ui.displayPrompt(`— ${currentRoom.getName()} —`);
      this.ui.displayPrompt(currentRoom.getDescription());
      this.ui.displayPrompt("");
      presentExits(this.ui, currentRoom);
      this.ui.displayPrompt("");
      this.ui.displayPrompt(
        "You feel the urge to INSPECT the items in the room. (Type INVENTORY to open inventory. Type QUIT to exit.)",
      );

      const command = (await this.ui.userInput()).trim().toUpperCase();

      if (command === "QUIT") {
        this.endGame();
        return;
      }

      if (command === "INVENTORY") {
        this.ui.clear();
        await this.viewInventory(player);
        continue;
      }

      if (command === "INSPECT") {
        this.ui.clear();
        await this.handleInspect(player);
        continue;
      }

      if (command === "PICKUP") {
        this.ui.clear();
        await this.handlePickup(player);
        continue;
      }

      const exits = currentRoom.getRoomOptions();
      if (exits.includes(command)) {
        await this.handleExitCommand(player, currentRoom, command);
        continue;
      }

      this.ui.clear();
      this.ui.displayPrompt(
        "You tried to choose your option but you couldn't move your body. It seems like there is an unforeseen force telling you can't perform that action.. You look around again",
      );
    }
  }

  private async handleExitCommand(
    player: Player,
    currentRoom: Room,
    command: string,
  ): Promise<void> {
    // Locked door keywords that need a key
    if (command === "DOOR") {
      this.ui.clear();
      this.handleDoors(player, currentRoom, "LIBRARY", ["LOUNGE", "LIBRARY"], command);
      // Keep map / player room in sync after mutation
      this.rooms.set(currentRoom.getName(), currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    const destination = this.rooms.get(command);
    if (destination) {
      this.ui.clear();
      player.setRoom(destination);
      this.ui.displayPrompt(`You move to the ${destination.getName()}.`);
      return;
    }

    this.ui.clear();
    this.ui.displayPrompt("You can't go that way.");
  }

  /**
   * Port of C++ handleDoors — unlock with matching key, update exits.
   */
  private handleDoors(
    player: Player,
    currentRoom: Room,
    _targetRoom: string,
    newRoomOptions: string[],
    command: string,
  ): void {
    const doors = currentRoom.getDoors();
    let wasKeyFound = false;

    for (let i = 0; i < doors.length; i++) {
      const door = doors[i];
      if (!door || !door.getIsLocked()) {
        continue;
      }
      if (player.getInventorySize() === 0) {
        continue;
      }

      const playerKey = player.searchForKey(door.getDoorKeyID());
      if (door.getDoorKeyID() === playerKey && command === door.getDoorName()) {
        player.useKey(playerKey);
        currentRoom.unlockDoorAt(i);
        currentRoom.setRoomOptions(newRoomOptions);
        wasKeyFound = true;
        break;
      }
    }

    if (!wasKeyFound) {
      this.ui.displayPrompt("The door is locked.");
    } else {
      this.ui.displayPrompt("You unlocked the door!");
      this.ui.displayPrompt("You can now traverse to the LIBRARY.");
    }
  }

  private async handleInspect(player: Player): Promise<void> {
    const currentRoom = player.getRoom();
    presentRoomItems(this.ui, currentRoom);
    this.ui.displayPrompt("");
    this.ui.displayPrompt("What item would you like to inspect?");

    const itemName = (await this.ui.userInput()).trim().toUpperCase();
    const item = currentRoom.getRoomItemByName(itemName);

    if (item.getName() !== itemName) {
      this.ui.displayPrompt("There is no such item here.");
      return;
    }

    this.ui.displayPrompt("");
    this.ui.displayPrompt(item.getDescription());
    this.ui.displayPrompt("");

    if (!item.getCanPickUp()) {
      this.ui.displayPrompt("You can't pick that up.");
      return;
    }

    this.ui.displayPrompt("Type PICKUP to pick up the item");
    const confirm = (await this.ui.userInput()).trim().toUpperCase();
    if (confirm === "PICKUP") {
      this.pickUpNamedItem(player, currentRoom, itemName);
    }
  }

  private async handlePickup(player: Player): Promise<void> {
    const currentRoom = player.getRoom();
    presentRoomItems(this.ui, currentRoom);
    this.ui.displayPrompt("");
    this.ui.displayPrompt("What item would you like to pick up?");

    const itemName = (await this.ui.userInput()).trim().toUpperCase();
    this.pickUpNamedItem(player, currentRoom, itemName);
  }

  private pickUpNamedItem(player: Player, currentRoom: Room, itemName: string): void {
    const item = currentRoom.getRoomItemByName(itemName);
    if (item.getName() !== itemName) {
      this.ui.displayPrompt("There is no such item here.");
      return;
    }
    if (!item.getCanPickUp()) {
      this.ui.displayPrompt("You can't pick that up.");
      return;
    }

    const removed = currentRoom.removeItemByName(itemName);
    if (!removed) {
      this.ui.displayPrompt("There is no such item here.");
      return;
    }

    const pickup = new PickUpItem(removed);
    pickup.addToInventory(player);
    this.rooms.set(currentRoom.getName(), currentRoom);
    player.setRoom(currentRoom);

    this.ui.clear();
    this.ui.displayPrompt(`You picked up ${itemName}.`);
    this.ui.displayPrompt("-----------");
  }

  private async viewInventory(player: Player): Promise<void> {
    presentInventory(this.ui, player);
    this.ui.displayPrompt("");
    if (player.getInventorySize() === 0) {
      return;
    }

    this.ui.displayPrompt("Type the name of an item to get its description, or press Enter to continue.");
    const choice = (await this.ui.userInput()).trim().toUpperCase();
    if (choice === "") {
      return;
    }

    const item = player.getItem(choice);
    if (item.getName() === "Unknown") {
      this.ui.displayPrompt("The item you entered is not in your inventory.");
      return;
    }

    this.ui.displayPrompt(`${item.getName()}: ${item.getDescription()}`);
  }
}
