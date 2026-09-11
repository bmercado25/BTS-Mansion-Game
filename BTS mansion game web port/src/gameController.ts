import type { UserInterface } from "./userInterface";
import { Interact } from "./interact";
import {
  PickUpItem,
  Player,
  Room,
  presentExits,
  presentInventory,
  presentRoomItems,
} from "./domain";
import {
  buildMansionWorld,
  createDiningHallKey,
  createGalleryHalfKey,
  createHolyWater,
  createMasterKey,
  createMazeMap,
  createMirrorHalfKey,
} from "./world";

/**
 * GameController — mansion world + interactions (Phase 6).
 */
export class GameController {
  private readonly ui: UserInterface;
  private rooms = new Map<string, Room>();
  private player: Player | null = null;
  private running = false;
  private kitchenDoorOpen = false;
  private diningHallDoorOpen = false;
  private studyPuzzleSolved = false;
  private galleryPuzzleSolved = false;
  private mirrorPuzzleSolved = false;
  private fountainPuzzleSolved = false;
  private mazePuzzleSolved = false;

  constructor(ui: UserInterface) {
    this.ui = ui;
  }

  async startGame(): Promise<void> {
    this.rooms = buildMansionWorld();
    this.kitchenDoorOpen = false;
    this.diningHallDoorOpen = false;
    this.studyPuzzleSolved = false;
    this.galleryPuzzleSolved = false;
    this.mirrorPuzzleSolved = false;
    this.fountainPuzzleSolved = false;
    this.mazePuzzleSolved = false;

    const foyer = this.rooms.get("FOYER");
    if (!foyer) {
      throw new Error("FOYER missing from mansion world.");
    }

    this.player = new Player(foyer);
    this.running = true;

    this.ui.clear();
    this.ui.displayPrompt(
      "INSTRUCTIONS: Any word that is in all caps, such as INSPECT, PICKUP or LOUNGE, is a keyword and can be inputted for an action",
    );
    this.ui.displayPrompt("");
    this.ui.displayPrompt(
      "It's always important to stay sane in such a stressful situation. The lower your sanity gets, the less you'll understand what is going on...",
    );
    this.ui.displayPrompt(
      "Unfortunately, it is only a matter of time before you completely lose it. Consume SANITY PILLS to increase your sanity.",
    );
    this.ui.displayPrompt("(Sanity timer not active yet — Phase 8.)");
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

  private syncRoom(room: Room): void {
    this.rooms.set(room.getName(), room);
  }

  private async gameLoop(): Promise<void> {
    if (!this.player) {
      return;
    }

    while (this.running) {
      const player = this.player;
      const currentRoom = player.getRoom();

      this.ui.displayPrompt("");
      this.ui.displayPrompt(`Sanity Level: ${player.getSanity()}`);
      this.ui.displayPrompt(`— ${currentRoom.getName()} —`);
      this.ui.displayPrompt(currentRoom.amendDescription());
      this.ui.displayPrompt("");
      presentExits(this.ui, currentRoom);
      this.ui.displayPrompt("");
      this.ui.displayPrompt(
        "You cant contain your curiosity and have the urge to INSPECT the items in the room. (type 'INVENTORY' to open inventory. Type 'QUIT' to exit the game)",
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

      if (command === "CANDLE" && currentRoom.getName() === "RITUAL ROOM") {
        this.ui.clear();
        this.handleRitualCandle(player, currentRoom);
        continue;
      }

      // Special door / passage commands (may or may not be in exit list wording)
      if (await this.handleSpecialMovement(player, currentRoom, command)) {
        continue;
      }

      const exits = currentRoom.getRoomOptions();
      if (exits.includes(command)) {
        await this.handleExitCommand(player, currentRoom, command);
        continue;
      }

      this.ui.clear();
      this.ui.displayPrompt(
        "You tried to choose your option but you couldn't move your body. It seems like there is an unforeseen force telling you can't perform that action..You look around again",
      );
    }
  }

  private async handleSpecialMovement(
    player: Player,
    currentRoom: Room,
    command: string,
  ): Promise<boolean> {
    const roomName = currentRoom.getName();

    if (command === "KITCHEN DOOR" && roomName === "KITCHEN") {
      this.ui.clear();
      if (!this.kitchenDoorOpen) {
        this.ui.displayPrompt("You open the door to the foyer.");
        this.kitchenDoorOpen = true;
      }
      const foyer = this.rooms.get("FOYER");
      if (foyer) {
        const options = foyer.getRoomOptions().filter((o) => o !== "KITCHEN DOOR");
        if (!options.includes("KITCHEN")) {
          options.push("KITCHEN");
        }
        foyer.setRoomOptions(options);
        this.syncRoom(foyer);
        player.setRoom(foyer);
      }
      this.ui.displayPrompt(
        "You are now in the foyer. You can use the 'KITCHEN' command to return to the kitchen.",
      );
      return true;
    }

    if (command === "KITCHEN DOOR" && roomName === "FOYER") {
      this.ui.clear();
      if (this.kitchenDoorOpen) {
        const kitchen = this.rooms.get("KITCHEN");
        if (kitchen) {
          this.ui.displayPrompt("You pass through the open door to the kitchen.");
          player.setRoom(kitchen);
        }
      } else {
        this.ui.displayPrompt("The door to the kitchen is locked from this side.");
      }
      return true;
    }

    if (command === "DINING HALL DOOR" && roomName === "DINING HALL") {
      this.ui.clear();
      if (!this.diningHallDoorOpen) {
        this.ui.displayPrompt("You open the door to the lounge.");
        this.diningHallDoorOpen = true;
      }
      const lounge = this.rooms.get("LOUNGE");
      if (lounge) {
        const options = lounge.getRoomOptions().filter((o) => o !== "DINING HALL DOOR");
        if (!options.includes("DINING HALL")) {
          options.push("DINING HALL");
        }
        lounge.setRoomOptions(options);
        this.syncRoom(lounge);
        player.setRoom(lounge);
      }
      this.ui.displayPrompt(
        "You are now in the lounge. You can use the 'DINING HALL' command to return to the dining hall.",
      );
      return true;
    }

    if (command === "DINING HALL" && roomName === "LOUNGE") {
      this.ui.clear();
      if (this.diningHallDoorOpen) {
        const dining = this.rooms.get("DINING HALL");
        if (dining) {
          this.ui.displayPrompt("You pass through the open door to the dining hall.");
          player.setRoom(dining);
        }
      } else {
        this.ui.displayPrompt("The door to the dining hall is locked from this side.");
      }
      return true;
    }

    if (command === "DINING HALL DOOR" && roomName === "LOUNGE") {
      this.ui.clear();
      this.ui.displayPrompt("The DINING HALL DOOR is locked from this side");
      return true;
    }

    if (command === "PORTAL") {
      this.ui.clear();
      this.handlePortal(player);
      return true;
    }

    return false;
  }

  private handlePortal(player: Player): void {
    if (player.getRoomName() === "UPSTAIRS") {
      const foyer = this.rooms.get("FOYER");
      if (foyer) {
        player.setRoom(foyer);
        this.ui.displayPrompt(
          "You step through the portal and find yourself back in the foyer (Room A).",
        );
      }
      return;
    }

    const upstairs = this.rooms.get("UPSTAIRS");
    if (!upstairs) {
      this.ui.displayPrompt("The portal flickers, but leads nowhere.");
      return;
    }

    this.ui.displayPrompt(
      "You step into the portal, and feel a strange pull as reality warps around you.",
    );
    this.ui.displayPrompt("You have entered the portal and now find yourself upstairs.");
    player.setRoom(upstairs);
  }

  private async handleExitCommand(
    player: Player,
    currentRoom: Room,
    command: string,
  ): Promise<void> {
    if (command === "DOOR") {
      this.ui.clear();
      this.handleDoors(player, currentRoom, ["LOUNGE", "LIBRARY", "KITCHEN DOOR"], command);
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    if (command === "BOOKSHELF") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        ["FOYER", "HIDDEN SECTION", "GREATER LIBRARY DOOR"],
        command,
        "You place the book on the shelf. The Bookshelf begins to move, screeching across the wooden floor. It reveals a staircase leading down to the HIDDEN SECTION.",
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    if (command === "GREATER LIBRARY DOOR") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        ["FOYER", "HIDDEN SECTION", "LIBRARY", "GREATER LIBRARY"],
        command,
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    if (command === "PUZZLE") {
      this.ui.clear();
      await this.handleStudyPuzzle(currentRoom);
      this.syncRoom(currentRoom);
      return;
    }

    if (command === "DOUBLE DOORS") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        [
          "PORTAL",
          "MIRROR ROOM 1",
          "MIRROR ROOM 2",
          "STORYTELLER'S ROOM",
          "GALLERY",
          "MASTER BEDROOM",
        ],
        command,
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    if (command === "BLOCKED HEDGE MAZE") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        ["SHED", "FOUNTAIN", "HEDGE MAZE"],
        command,
        "You pour the holy water on the dark force blocking the entrance to the hedge maze, granting yourself access as the dark sludge burns away.",
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    if (command === "MAZE EXIT") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        ["GARDEN", "HEDGE MAZE EXIT"],
        command,
        "Using the map, you are able to find your way out of the maze, reaching the exit.",
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
      return;
    }

    // Already handled in special movement, but keep as exit fallback
    if (
      command === "KITCHEN DOOR" ||
      command === "DINING HALL DOOR" ||
      command === "DINING HALL" ||
      command === "PORTAL"
    ) {
      await this.handleSpecialMovement(player, currentRoom, command);
      return;
    }

    const destination = this.rooms.get(command);
    if (destination) {
      this.ui.clear();
      player.setRoom(destination);
      return;
    }

    this.ui.clear();
    this.ui.displayPrompt("You can't go that way.");
  }

  private handleDoors(
    player: Player,
    currentRoom: Room,
    newRoomOptions: string[],
    command: string,
    openMessage = "",
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
        if (openMessage) {
          this.ui.displayPrompt(openMessage);
        }
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
    }
  }

  private async handleStudyPuzzle(currentRoom: Room): Promise<void> {
    if (this.studyPuzzleSolved) {
      this.ui.displayPrompt("The puzzle is already solved. You can enter the STUDY.");
      return;
    }

    this.ui.displayPrompt(
      "WORK IN PROGRESS: The door is locked there seems to be a puzzle before entering. Solve this puzzle.",
    );
    this.ui.displayPrompt("The secret word is YDDID");
    const puzzleAnswer = (await this.ui.userInput()).trim().toUpperCase();

    if (puzzleAnswer === "YDDID") {
      this.ui.displayPrompt("You solved the puzzle you can now enter the study");
      this.studyPuzzleSolved = true;
      currentRoom.setRoomOptions(["LIBRARY", "STUDY"]);
    } else {
      this.ui.displayPrompt("That is not the correct answer. The door remains locked.");
    }
  }

  private handleRitualCandle(player: Player, currentRoom: Room): void {
    if (player.inInventory("CANDLE", "C1")) {
      player.useItemWithId("CANDLE", "C1");
      this.ui.displayPrompt("You have placed a candle");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      this.ui.displayPrompt(
        "As you place the candle, a hidden tunnel opens, leading to the kitchen!",
      );
      const options = currentRoom.getRoomOptions();
      if (!options.includes("KITCHEN")) {
        options.push("KITCHEN");
        currentRoom.setRoomOptions(options);
      }
      this.syncRoom(currentRoom);
      return;
    }

    if (player.inInventory("CANDLE", "C2")) {
      player.useItemWithId("CANDLE", "C2");
      this.ui.displayPrompt("You have placed a candle");
      currentRoom.addCandle();
      this.ui.displayPrompt("As you place the candle, a portal is revealed!");
      this.ui.displayPentacle(currentRoom.getCandleValue());
      const options = currentRoom.getRoomOptions();
      if (!options.includes("PORTAL")) {
        options.push("PORTAL");
        currentRoom.setRoomOptions(options);
      }
      this.syncRoom(currentRoom);
      return;
    }

    // C3 / C4 — place on the pentacle (no extra unlock in C++ ritual branch)
    for (const id of ["C3", "C4"] as const) {
      if (player.inInventory("CANDLE", id)) {
        player.useItemWithId("CANDLE", id);
        this.ui.displayPrompt("You have placed a candle");
        currentRoom.addCandle();
        this.ui.displayPentacle(currentRoom.getCandleValue());
        this.syncRoom(currentRoom);
        return;
      }
    }

    this.ui.displayPrompt("You do not have a candle");
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

    if (item.getCanPickUp()) {
      this.ui.displayPrompt("Type PICKUP to pick up the item");
      const confirm = (await this.ui.userInput()).trim().toUpperCase();
      if (confirm === "PICKUP") {
        this.pickUpNamedItem(player, currentRoom, itemName);
      }
      return;
    }

    // C++ GameController special-cases METAL SAFE by name during INSPECT
    if (itemName === "METAL SAFE" || item.getInteraction()?.kind === "safe") {
      await this.handleSafe(currentRoom);
      return;
    }

    const interaction = item.getInteraction();
    if (!interaction) {
      this.ui.displayPrompt("You can't pick that up.");
      return;
    }

    if (interaction.kind === "puzzle") {
      await this.handlePuzzleStub(player, interaction.puzzleId);
      return;
    }

    // Non-puzzle InteractClass::runInteraction() path
    const interact = Interact.fromHook(this.ui, interaction);
    await interact.runMessageInteraction();
  }

  /**
   * Puzzle modules not ported yet — stubs still award progression items so map gating works.
   */
  private async handlePuzzleStub(
    player: Player,
    puzzleId: "gallery" | "mirror" | "fountain" | "maze" | undefined,
  ): Promise<void> {
    if (puzzleId === "gallery") {
      if (this.galleryPuzzleSolved) {
        this.ui.displayPrompt("This item seems dormant.");
        return;
      }
      this.ui.displayPrompt("Do you want to initiate puzzle? (YES or NO)");
      const answer = (await this.ui.userInput()).trim().toUpperCase();
      if (answer !== "YES") {
        this.ui.displayPrompt("You walk away.");
        return;
      }
      this.ui.displayPrompt("Puzzle not ported yet — granting GALLERY HALF KEY for exploration.");
      this.galleryPuzzleSolved = true;
      player.addItem(createGalleryHalfKey());
      this.tryCombineMasterKey(player);
      return;
    }

    if (puzzleId === "mirror") {
      if (this.mirrorPuzzleSolved) {
        this.ui.displayPrompt("You already solved this puzzle.");
        return;
      }
      this.ui.displayPrompt("Do you want to solve the three word combination? (YES or NO)");
      const answer = (await this.ui.userInput()).trim().toUpperCase();
      if (answer !== "YES") {
        this.ui.displayPrompt("You walk away.");
        return;
      }
      this.ui.displayPrompt(
        "Puzzle not ported yet — granting MIRROR HALF KEY for exploration.",
      );
      this.ui.displayPrompt(
        "You solved the Mirror Puzzle! You recieved a half of a key in your inventory.",
      );
      this.mirrorPuzzleSolved = true;
      player.addItem(createMirrorHalfKey());
      this.tryCombineMasterKey(player);
      return;
    }

    if (puzzleId === "fountain") {
      if (this.fountainPuzzleSolved) {
        this.ui.displayPrompt("This item seems dormant.");
        return;
      }
      this.ui.displayPrompt("Do you want to begin the Fountain Puzzle? (YES or NO)");
      const answer = (await this.ui.userInput()).trim().toUpperCase();
      if (answer !== "YES") {
        this.ui.displayPrompt("You walk away.");
        return;
      }
      this.ui.displayPrompt("Puzzle not ported yet — granting HOLY WATER for exploration.");
      this.ui.displayPrompt("You solved the Fountain Puzzle!");
      this.fountainPuzzleSolved = true;
      player.addItem(createHolyWater());
      return;
    }

    if (puzzleId === "maze") {
      if (this.mazePuzzleSolved) {
        this.ui.displayPrompt("This item seems dormant.");
        return;
      }
      this.ui.displayPrompt(
        "You should explore the maze, paying attention to your surrondings, do you want to explore? (YES or NO)",
      );
      const answer = (await this.ui.userInput()).trim().toUpperCase();
      if (answer !== "YES") {
        this.ui.displayPrompt("You walk away.");
        return;
      }
      this.ui.displayPrompt("Puzzle not ported yet — granting MAZE MAP for exploration.");
      this.ui.displayPrompt("You solved the Maze Puzzle!");
      this.ui.displayPrompt(
        "You find a map of the maze at the end of this sequence of symbols, picking it up to navigate the maze.",
      );
      this.mazePuzzleSolved = true;
      player.addItem(createMazeMap());
      return;
    }

    this.ui.displayPrompt("Puzzle not ported yet");
  }

  private tryCombineMasterKey(player: Player): void {
    const hasGallery = player.inInventory("GALLERY HALF KEY");
    const hasMirror = player.inInventory("MIRROR HALF KEY");
    if (!hasGallery || !hasMirror) {
      return;
    }
    player.removeItem("GALLERY HALF KEY");
    player.removeItem("MIRROR HALF KEY");
    this.ui.displayPrompt(
      "You put both halves of your key together to form the MASTER BEDROOM KEY!",
    );
    player.addItem(createMasterKey());
  }

  private async handleSafe(currentRoom: Room): Promise<void> {
    // Matches C++ INSPECT → METAL SAFE branch (code entry after selecting the safe)
    this.ui.displayPrompt("Enter the 4 digit code");
    const safeInput = (await this.ui.userInput()).trim();

    if (safeInput === "8691") {
      this.ui.displayPrompt(
        "You entered the correct passcode! Safe is now open and there's a key",
      );
      currentRoom.removeItemByName("METAL SAFE");
      currentRoom.addItem(createDiningHallKey());
      this.syncRoom(currentRoom);
      presentRoomItems(this.ui, currentRoom);
    } else {
      this.ui.displayPrompt("You entered the wrong passcode. Try again");
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
    this.syncRoom(currentRoom);
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

    this.ui.displayPrompt(
      "Type the name of an item to get its description, or press Enter to continue.",
    );
    const choice = (await this.ui.userInput()).trim().toUpperCase();
    if (choice === "") {
      return;
    }

    const item = player.getItem(choice);
    if (item.getName() === "Unknown") {
      this.ui.displayPrompt("The item you entered is not in your inventory.");
      return;
    }

    this.ui.clear();
    this.ui.displayPrompt(`${item.getName()}: ${item.getDescription()}`);

    if (item.getName() === "BOTTLE OF PILLS") {
      // Match C++ inventory use behavior (sanity restore); timer arrives in Phase 8.
      const amount = item.getValue();
      player.setSanity(Math.max(0, Math.min(100, player.getSanity() + amount)));
      player.useItem("BOTTLE OF PILLS");
      this.ui.displayPrompt(
        "You used the bottle of sanity pills. The world makes a bit more sense again.",
      );
      this.ui.displayPrompt(`Sanity Level: ${player.getSanity()}`);
    }
  }
}
