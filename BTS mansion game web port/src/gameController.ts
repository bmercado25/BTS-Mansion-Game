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
  createCandle5,
  createDiningHallKey,
  createGalleryHalfKey,
  createHolyWater,
  createMasterKey,
  createMazeMap,
  createMirrorHalfKey,
  createPlayerMemory,
  createSight,
  createStudyKey,
} from "./world";
import {
  MirrorPuzzle,
  FountainPuzzle,
  MazePuzzle,
  GalleryPuzzle,
  ChantPuzzle,
  MemoryPuzzle,
  GreaterLibraryPuzzle,
} from "./puzzles";
import { MonsterTimer, MONSTER_GRAB_ART } from "./monster";
import { GOOD_ENDING, NEUTRAL_ENDING, BAD_ENDING } from "./endings";
import { BACKSTORY } from "./backstory";

/**
 * GameController — mansion world + interactions + monster timer (R4).
 */
export class GameController {
  private readonly ui: UserInterface;
  private rooms = new Map<string, Room>();
  private player: Player | null = null;
  private running = false;
  private kitchenDoorOpen = false;
  private diningHallDoorOpen = false;
  private mirrorPuzzle = new MirrorPuzzle();
  private fountainPuzzle = new FountainPuzzle();
  private mazePuzzle = new MazePuzzle();
  private galleryPuzzle = new GalleryPuzzle();
  private chantPuzzle = new ChantPuzzle();
  private memoryPuzzle = new MemoryPuzzle();
  private greaterLibraryPuzzle = new GreaterLibraryPuzzle();
  private memoryGobletIsActive = false;
  /** Browser stand-in for C++ sanitySequence thread. */
  private sanityTimerId: ReturnType<typeof setInterval> | null = null;
  /** Prevents lose/ending from double-firing (e.g. sanity tick after C5). */
  private outcomeSettled = false;
  /** C++ isInProtectedAction — inspect / inventory / candles / safe rooms. */
  private isInProtectedAction = false;
  private monster: MonsterTimer | null = null;
  /** When set, game loop awaits grab before accepting the next command. */
  private grabPromise: Promise<void> | null = null;

  constructor(ui: UserInterface) {
    this.ui = ui;
  }

  async startGame(): Promise<void> {
    this.rooms = buildMansionWorld();
    this.kitchenDoorOpen = false;
    this.diningHallDoorOpen = false;
    this.mirrorPuzzle = new MirrorPuzzle();
    this.fountainPuzzle = new FountainPuzzle();
    this.mazePuzzle = new MazePuzzle();
    this.galleryPuzzle = new GalleryPuzzle();
    this.chantPuzzle = new ChantPuzzle();
    this.memoryPuzzle = new MemoryPuzzle();
    this.greaterLibraryPuzzle = new GreaterLibraryPuzzle();
    this.memoryGobletIsActive = false;
    this.outcomeSettled = false;
    this.isInProtectedAction = false;
    this.grabPromise = null;

    const foyer = this.rooms.get("FOYER");
    if (!foyer) {
      throw new Error("FOYER missing from mansion world.");
    }

    this.player = new Player(foyer);
    this.running = true;

    this.ui.clear();
    await this.displayBackstory();

    this.ui.clear();
    this.ui.displayPrompt(
      "It's always important to stay sane in such a stressful situation. The lower your sanity gets, the less you'll understand what is going on...",
    );
    this.ui.displayPrompt(
      "Unfortunately, it is only a matter of time before you completely lose it. Consume SANITY PILLS to increase your sanity.",
    );
    this.ui.displayPrompt(
      "A presence stalks the mansion — when it nears, HIDE in closets, under tables, or under beds.",
    );
    this.ui.displayPrompt("");

    this.startSanitySequence();
    this.startMonsterTimer();
    await this.gameLoop();
  }

  /** Port of GameControllerClass::displayBackstory — line-by-line waitForInput. */
  private async displayBackstory(): Promise<void> {
    const lines = BACKSTORY.split("\n");
    for (const line of lines) {
      this.ui.displayPrompt(line);
      await this.ui.waitForInput();
    }
  }

  endGame(): void {
    this.finishGame();
  }

  /** Match C++ GameControllerClass::inProtectedState. */
  inProtectedState(): boolean {
    return this.isInProtectedAction;
  }

  /** Sanity / monster / quit lose path. */
  private finishGame(): void {
    if (this.outcomeSettled) {
      return;
    }
    this.outcomeSettled = true;
    this.stopSanitySequence();
    this.stopMonsterTimer();
    this.running = false;
    this.ui.cancelAsk();

    this.ui.clear();
    this.ui.displayPrompt(
      "Your world disappears around you. You are still aware but there is nothing,",
    );
    this.ui.displayPrompt("like someone pulled the plug on your brain - Am I dead?");
    this.ui.displayPrompt("...You wonder if this will end.");
    this.ui.displayPrompt("Thank you for playing");
  }

  /**
   * After C5 / endingSequence — clear + thank-you (C++ endGame flavor overload).
   */
  private settleAfterEnding(): void {
    if (this.outcomeSettled) {
      return;
    }
    this.outcomeSettled = true;
    this.stopSanitySequence();
    this.stopMonsterTimer();
    this.running = false;
    this.ui.cancelAsk();
    this.ui.clear();
    this.ui.displayPrompt("Thank you for playing.");
  }

  /**
   * Port of C++ updateSanity — clamp to 0..100.
   */
  private updateSanity(player: Player, amount: number): void {
    player.setSanity(Math.max(0, Math.min(100, player.getSanity() + amount)));
  }

  /**
   * Port of C++ sanitySequence (std::thread → setInterval).
   * Latest C++: drain 1, sleep 9s, if sanity < 2 endGame, repeat.
   */
  private startSanitySequence(): void {
    this.stopSanitySequence();
    if (!this.player) {
      return;
    }

    // Immediate first drain (C++ thread drains before first sleep).
    this.drainSanityTick(false);

    this.sanityTimerId = setInterval(() => {
      this.sanitySequenceTick();
    }, 9000);
  }

  private stopSanitySequence(): void {
    if (this.sanityTimerId !== null) {
      clearInterval(this.sanityTimerId);
      this.sanityTimerId = null;
    }
  }

  /** After each 9s wait: check game-over, then drain again. */
  private sanitySequenceTick(): void {
    if (!this.running || !this.player) {
      this.stopSanitySequence();
      return;
    }

    // C++ checks after the sleep.
    if (this.player.getSanity() < 2) {
      this.endGame();
      return;
    }

    this.drainSanityTick(true);
  }

  /**
   * Drain 1 sanity (latest C++). Optional UI line must not call ask() (print-only).
   */
  private drainSanityTick(announce: boolean): void {
    if (!this.player) {
      return;
    }
    this.player.setSanity(this.player.getSanity() - 1);
    if (announce) {
      // Non-blocking: print while ask() may be waiting.
      this.ui.displayPrompt(
        `Your mind frays... Sanity: ${this.player.getSanity()}`,
      );
      if (this.player.getSanity() < 2) {
        this.endGame();
      }
    }
  }

  /** Port of MonsterClass (120s) via setInterval. */
  private startMonsterTimer(): void {
    this.stopMonsterTimer();
    this.monster = new MonsterTimer(120, {
      isProtected: () => this.inProtectedState(),
      onApproaching: () => {
        if (!this.running) {
          return;
        }
        this.ui.displayPrompt(
          "The monster is approching, you must hide, hurry!",
        );
      },
      onTriggered: () => {
        if (!this.running) {
          return;
        }
        // C++ skips grab while protected, then loop restarts the timer.
        if (this.inProtectedState()) {
          this.monster?.start();
          return;
        }
        this.grabPromise = this.runMonsterGrabSequence();
      },
    });
    this.monster.start();
  }

  private stopMonsterTimer(): void {
    this.monster?.stop();
    this.monster = null;
  }

  /**
   * Port of MonsterClass::onTimerTriggered — print-only until Enter wake-up.
   */
  private async runMonsterGrabSequence(): Promise<void> {
    if (!this.player || !this.running) {
      return;
    }

    this.ui.cancelAsk();
    this.ui.clear();
    this.ui.displayPrompt(
      "A shadowy monster with elongated limbs grabs you, as the shadows encapsulating this monster consume you and all you can feel is its cold embrace.",
    );
    this.ui.displayPre(MONSTER_GRAB_ART);
    this.ui.displayPrompt(
      "The longer you stare, the more you feel you lose your ties to reality, as if it was sucking the life out of you",
    );

    await this.ui.sleep(5000);
    if (!this.running) {
      return;
    }

    this.ui.displayPrompt(
      "Its been satisfied -- It disappears into nothingness, you have lost 30 sanity. and fall to the ground",
    );
    await this.ui.sleep(5000);
    if (!this.running || !this.player) {
      return;
    }

    this.player.setSanity(this.player.getSanity() - 30);
    this.ui.clear();

    if (this.player.getSanity() <= 0) {
      this.ui.displayPrompt(
        "The monster sucked the remaining life out of your body",
      );
      this.ui.displayPrompt("You are unable to wake up");
      await this.ui.sleep(3000);
      this.endGame();
      return;
    }

    this.ui.displayPrompt("Press ENTER to wake up");
    await this.ui.waitForInput();
    if (!this.running) {
      return;
    }
    this.ui.clear();

    // C++ game loop restarts the monster after a trigger.
    this.monster?.start();
  }

  /**
   * Protect during inspect / inventory / candle (C++ isInProtectedAction).
   * Restores safe-room protection afterward.
   */
  private async withProtectedAction<T>(
    action: () => Promise<T> | T,
  ): Promise<T> {
    this.isInProtectedAction = true;
    try {
      return await action();
    } finally {
      this.isInProtectedAction = this.player?.getRoom().getIsSafe() ?? false;
    }
  }

  /** After movement: sync protected flag; reset monster when entering a hide. */
  private onPlayerMoved(player: Player): void {
    const safe = player.getRoom().getIsSafe();
    this.isInProtectedAction = safe;
    if (safe) {
      this.monster?.reset();
    }
  }

  private syncRoom(room: Room): void {
    this.rooms.set(room.getName(), room);
  }

  private async gameLoop(): Promise<void> {
    if (!this.player) {
      return;
    }

    while (this.running) {
      if (this.grabPromise) {
        await this.grabPromise;
        this.grabPromise = null;
        if (!this.running) {
          return;
        }
      }

      const player = this.player;
      const currentRoom = player.getRoom();
      // Stay protected while lingering in a hide room.
      this.isInProtectedAction = currentRoom.getIsSafe();

      this.ui.displayPrompt("");
      this.ui.displayPrompt(`Sanity Level: ${player.getSanity()}`);
      this.ui.displayPrompt(`— ${currentRoom.getName()} —`);
      if (currentRoom.getHasConditionalDescription()) {
        // C++ conditional (Sight) path is not jumbled.
        this.ui.displayPrompt(
          currentRoom.conditionalDescription(
            player.getInventory(),
            createSight(),
          ),
        );
      } else {
        // C++ AmendDescription via displayPrompt(text, sanity) — jumble at ≤35.
        this.ui.displayPrompt(
          currentRoom.amendDescription(),
          player.getSanity(),
        );
      }
      this.ui.displayPrompt("");
      presentExits(this.ui, currentRoom);
      this.ui.displayPrompt("");
      this.ui.displayPrompt(
        "You cant contain your curiosity and have the urge to INSPECT the items in the room. (type 'INVENTORY' to open inventory. Type 'QUIT' to exit the game)",
      );

      if (this.grabPromise) {
        await this.grabPromise;
        this.grabPromise = null;
        if (!this.running) {
          return;
        }
        continue;
      }

      const command = (await this.ui.userInput()).trim().toUpperCase();
      if (this.grabPromise) {
        await this.grabPromise;
        this.grabPromise = null;
      }
      if (!this.running) {
        return;
      }

      if (command === "QUIT") {
        this.endGame();
        return;
      }

      if (command === "SANITY") {
        this.ui.clear();
        this.ui.displayPrompt(`SANITY: ${player.getSanity()}`);
        await this.ui.sleep(500);
        this.ui.clear();
        continue;
      }

      if (command === "ESCAPE") {
        this.ui.displayPrompt(
          "You manage to escape the grasp of the monster and are back in the same room you just were in.",
        );
        continue;
      }

      if (command === "INVENTORY") {
        this.ui.clear();
        await this.withProtectedAction(() => this.viewInventory(player));
        if (!this.running) {
          return;
        }
        continue;
      }

      if (command === "INSPECT") {
        this.ui.clear();
        await this.withProtectedAction(() => this.handleInspect(player));
        if (!this.running) {
          return;
        }
        continue;
      }

      if (command === "PICKUP") {
        this.ui.clear();
        await this.handlePickup(player);
        if (!this.running) {
          return;
        }
        continue;
      }

      if (command === "CANDLE" && currentRoom.getName() === "RITUAL ROOM") {
        this.ui.clear();
        await this.withProtectedAction(() =>
          this.handleRitualCandle(player, currentRoom),
        );
        if (!this.running) {
          return;
        }
        continue;
      }

      // Special door / passage commands (may or may not be in exit list wording)
      if (await this.handleSpecialMovement(player, currentRoom, command)) {
        this.onPlayerMoved(player);
        if (!this.running) {
          return;
        }
        continue;
      }

      const exits = currentRoom.getRoomOptions();
      if (exits.includes(command)) {
        await this.handleExitCommand(player, currentRoom, command);
        this.onPlayerMoved(player);
        if (!this.running) {
          return;
        }
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

    if (command === "STUDY DOOR") {
      this.ui.clear();
      this.handleDoors(
        player,
        currentRoom,
        ["LIBRARY", "BALLROOM", "STUDY"],
        command,
        "You unlock the door with the study key, unlocking the study.",
      );
      this.syncRoom(currentRoom);
      player.setRoom(currentRoom);
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
        ["SHED", "FOUNTAIN", "HEDGE MAZE", "GRAVEYARD"],
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

  /**
   * Port of C++ ritual CANDLE branches (letters M A L U M + teleports).
   * C3–C5 call addCandle for pentacle consistency (C++ omits some).
   */
  private async handleRitualCandle(
    player: Player,
    currentRoom: Room,
  ): Promise<void> {
    if (player.getInventorySize() === 0) {
      this.ui.displayPrompt("You do not have a candle");
      return;
    }

    if (player.inInventory("CANDLE", "C1")) {
      player.useItemWithId("CANDLE", "C1");
      this.ui.displayPrompt("You have placed a candle.");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      await this.ui.sleep(10_000);

      this.ui.displayPrompt(
        "As you place the candle, a hidden tunnel opens, leading to the kitchen!",
      );
      this.ui.displayPrompt("A significant symbol appears in your path:");
      this.ui.displayPrompt("M");

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
      this.ui.displayPrompt("You have placed the 2nd candle.");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      await this.ui.sleep(12_000);

      this.ui.displayPrompt("As you place the candle, a portal is revealed!");
      this.ui.displayPrompt("A significant symbol appears in your path:");
      this.ui.displayPrompt("A");

      const options = currentRoom.getRoomOptions();
      if (!options.includes("PORTAL")) {
        options.push("PORTAL");
        currentRoom.setRoomOptions(options);
      }
      this.syncRoom(currentRoom);
      return;
    }

    if (player.inInventory("CANDLE", "C3")) {
      this.ui.displayPrompt("You place the 3rd candle.");
      player.useItemWithId("CANDLE", "C3");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      await this.ui.sleep(12_000);

      this.ui.displayPrompt("A significant symbol appears in your path:");
      this.ui.displayPrompt("L");
      await this.ui.sleep(8000);
      this.syncRoom(currentRoom);
      return;
    }

    if (player.inInventory("CANDLE", "C4")) {
      this.ui.displayPrompt("You place the 4th candle.");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      await this.ui.sleep(12_000);

      this.ui.displayPrompt("A significant symbol appears in your path:");
      this.ui.displayPrompt("U");
      await this.ui.sleep(6000);

      player.useItemWithId("CANDLE", "C4");
      this.syncRoom(currentRoom);

      const memory = this.rooms.get("MEMORY OF THE MANSION");
      if (memory) {
        player.setRoom(memory);
      }
      await this.playTeleportSequence();
      await this.ui.sleep(3000);
      this.ui.clear();
      return;
    }

    if (player.inInventory("CANDLE", "C5")) {
      this.ui.displayPrompt("It is final...");
      player.useItemWithId("CANDLE", "C5");
      currentRoom.addCandle();
      this.ui.displayPentacle(currentRoom.getCandleValue());
      await this.ui.sleep(12_000);

      this.ui.displayPrompt("A significant symbol appears in your path:");
      this.ui.displayPrompt("M");
      await this.ui.sleep(7000);

      this.ui.clear();
      await this.endingSequence();
      await this.ui.sleep(3000);
      this.settleAfterEnding();
      return;
    }

    this.ui.displayPrompt("You do not have a candle");
  }

  /**
   * Port of GameControllerClass::playTeleportSequence — spam then clear.
   * Scaled down from C++'s 10k sync loop so the browser stays responsive.
   */
  private async playTeleportSequence(): Promise<void> {
    for (let i = 0; i < 48; i++) {
      this.ui.displayPrompt("WHERE AM I GOING");
      if (i % 3 === 0 && i < 18) {
        this.ui.displayPrompt("HELP ME");
      }
      if (i > 12) {
        this.ui.displayPrompt("THERE IS NO COMING BACK NOW");
      }
      if (i % 4 === 0) {
        await this.ui.sleep(16);
      }
    }
    this.ui.clear();
  }

  /**
   * Port of GameControllerClass::endingSequence.
   * HENRY → good; MALUM (without HENRY) → neutral; neither → bad.
   */
  private async endingSequence(): Promise<void> {
    // Stop threats before the name prompt / long text (any ending path).
    this.stopSanitySequence();
    this.stopMonsterTimer();

    this.ui.displayPrompt("I AM...");
    for (let i = 0; i < 2; i++) {
      await this.ui.sleep(1000);
      this.ui.displayPrompt("I AM");
    }

    let neutralSequence = false;
    let goodSequence = false;

    for (let i = 0; i < 3; i++) {
      if (goodSequence) {
        break;
      }
      this.ui.displayPrompt("SAY MY NAME");
      const command = (await this.ui.userInput()).trim().toUpperCase();

      if (command === "MALUM") {
        neutralSequence = true;
      } else if (command === "HENRY") {
        goodSequence = true;
      }
    }

    if (!neutralSequence && !goodSequence) {
      await this.displayEndingLines(BAD_ENDING);
    } else if (neutralSequence && !goodSequence) {
      await this.displayEndingLines(NEUTRAL_ENDING);
    } else if (goodSequence) {
      await this.displayEndingLines(GOOD_ENDING);
    }
  }

  /** C++ istringstream + getline + waitForInput per line. */
  private async displayEndingLines(ending: string): Promise<void> {
    const lines = ending.split("\n");
    for (const line of lines) {
      this.ui.displayPrompt(line);
      await this.ui.waitForInput();
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

    if (item.getCanPickUp()) {
      this.ui.displayPrompt("Type PICKUP to pick up the item");
      const confirm = (await this.ui.userInput()).trim().toUpperCase();
      if (confirm === "PICKUP") {
        await this.pickUpNamedItem(player, currentRoom, itemName);
      }
      return;
    }

    // C++ GameController special-cases METAL SAFE by name during INSPECT
    if (itemName === "METAL SAFE" || item.getInteraction()?.kind === "safe") {
      await this.handleSafe(currentRoom);
      return;
    }

    // C++ special-cases MEMORY GOBLET after description (Sight / YOUR MEMORY flow)
    if (itemName === "MEMORY GOBLET") {
      await this.handleMemoryGoblet(player);
      return;
    }

    const interaction = item.getInteraction();
    if (!interaction) {
      this.ui.displayPrompt("You can't pick that up.");
      return;
    }

    if (interaction.kind === "puzzle") {
      if (interaction.puzzleId === "mirror") {
        await this.handleMirrorPuzzle(player);
        return;
      }
      if (interaction.puzzleId === "fountain") {
        await this.handleFountainPuzzle(player);
        return;
      }
      if (interaction.puzzleId === "maze") {
        await this.handleMazePuzzle(player);
        return;
      }
      if (interaction.puzzleId === "gallery") {
        await this.handleGalleryPuzzle(player);
        return;
      }
      if (interaction.puzzleId === "chant") {
        await this.handleChantPuzzle(player);
        return;
      }
      if (interaction.puzzleId === "memory") {
        await this.handleMemoryPuzzle(player);
        return;
      }
      if (interaction.puzzleId === "greaterLibrary") {
        await this.handleGreaterLibraryPuzzle(player);
        return;
      }
      await this.handlePuzzleStub(player, interaction.puzzleId);
      return;
    }

    // Non-puzzle InteractClass::runInteraction() path
    const interact = Interact.fromHook(this.ui, interaction);
    await interact.runMessageInteraction();
  }

  /**
   * Port of InteractClass mirror branch + MirrorPuzzle::runPuzzle().
   * C++ overloaded runInteraction runs the mirror puzzle directly (no YES gate).
   */
  private async handleMirrorPuzzle(player: Player): Promise<void> {
    if (this.mirrorPuzzle.isSolved()) {
      this.ui.displayPrompt("You already solved this puzzle.");
      return;
    }

    const solved = await this.mirrorPuzzle.runPuzzle(this.ui);
    if (solved) {
      this.ui.displayPrompt(
        "You solved the Mirror Puzzle! You recieved a half of a key in your inventory.",
      );
      player.addItem(createMirrorHalfKey());
      this.tryCombineMasterKey(player);
      return;
    }

    this.ui.displayPrompt("You failed to solve the mirror puzzle");
  }

  /**
   * Port of InteractClass fountain branch + FountainPuzzle::runPuzzle().
   */
  private async handleFountainPuzzle(player: Player): Promise<void> {
    if (this.fountainPuzzle.isSolved()) {
      this.ui.displayPrompt("This item seems dormant.");
      return;
    }

    const solved = await this.fountainPuzzle.runPuzzle(this.ui);
    if (solved) {
      this.ui.displayPrompt("You solved the Fountain Puzzle!");
      player.addItem(createHolyWater());
    }
  }

  /**
   * Port of InteractClass maze branch + MazePuzzle::runPuzzle().
   */
  private async handleMazePuzzle(player: Player): Promise<void> {
    if (this.mazePuzzle.isSolved()) {
      this.ui.displayPrompt("This item seems dormant.");
      return;
    }

    this.ui.displayPrompt("Are you ready to traverse the maze? (YES OR NO)");
    if ((await this.ui.userInput()) !== "YES") {
      this.ui.clear();
      return;
    }

    this.ui.clear();
    const solved = await this.mazePuzzle.runPuzzle(this.ui);
    if (solved) {
      this.ui.displayPrompt("You solved the Maze Puzzle!");
      this.ui.displayPrompt(
        "You find a map of the maze at the end of this sequence of symbols. You pick it up to navigate the maze.",
      );
      player.addItem(createMazeMap());
      return;
    }

    this.ui.displayPrompt("You failed the Maze Puzzle.");
  }

  /**
   * Port of InteractClass gallery branch + GalleryPuzzle::runPuzzle().
   * Asks YES first (unlike mirror/fountain/maze overloaded paths).
   */
  private async handleGalleryPuzzle(player: Player): Promise<void> {
    if (this.galleryPuzzle.isSolved()) {
      this.ui.displayPrompt("This item seems dormant.");
      return;
    }

    this.ui.displayPrompt("Do you want to initiate puzzle? (YES or NO)");
    const answer = (await this.ui.userInput()).trim().toUpperCase();
    if (answer !== "YES") {
      this.ui.displayPrompt("You walk away.");
      return;
    }

    const solved = await this.galleryPuzzle.runPuzzle(this.ui);
    if (solved) {
      player.addItem(createGalleryHalfKey());
      this.tryCombineMasterKey(player);
    }
  }

  /**
   * Port of InteractClass chant branch + GameController C5 teleport follow-up.
   */
  private async handleChantPuzzle(player: Player): Promise<void> {
    if (this.chantPuzzle.isSolved()) {
      this.ui.displayPrompt("This item seems dormant.");
      return;
    }

    const solved = await this.chantPuzzle.runPuzzle(this.ui);
    if (!solved) {
      return;
    }

    this.ui.displayPrompt(
      "The monster roars as you chant, you get teleported back to the ritual room with the 5th candle in your hand",
    );
    this.ui.displayPrompt(
      "WORK IN PROGRESS: Functionality to teleport back to the RITUAL ROOM",
    );
    player.addItem(createCandle5());

    // GameController post-C5 sequence (actual teleport).
    this.ui.clear();
    this.ui.displayPrompt("The monster roars awake.");
    await this.ui.sleep(9000);
    this.ui.displayPrompt(
      "You recieve the final candle, its waiting to be set down on the pentagrams edge",
    );
    await this.ui.sleep(4000);

    const ritual = this.rooms.get("RITUAL ROOM");
    if (ritual) {
      player.setRoom(ritual);
      this.onPlayerMoved(player);
    }
  }

  /**
   * Port of InteractClass memory branch + MemoryPuzzle::runPuzzle().
   */
  private async handleMemoryPuzzle(player: Player): Promise<void> {
    if (this.memoryPuzzle.isSolved()) {
      this.ui.displayPrompt("This item seems dormant.");
      return;
    }

    const solved = await this.memoryPuzzle.runPuzzle(this.ui);
    if (solved) {
      this.ui.displayPrompt(
        "The memories react positively to your answers, they break free from the crystal tank and attack your body, ripping out a memory of your own, they place it in your hand and go back into the tank",
      );
      player.addItem(createPlayerMemory());
    }
  }

  /**
   * Port of InteractClass greater-library branch + GreaterLibraryPuzzle::runPuzzle().
   * Runs directly (no YES gate). Awards STUDY KEY for STUDY DOOR.
   */
  private async handleGreaterLibraryPuzzle(player: Player): Promise<void> {
    if (this.greaterLibraryPuzzle.isSolved()) {
      this.ui.displayPrompt("This has already been unlocked.");
      return;
    }

    const solved = await this.greaterLibraryPuzzle.runPuzzle(this.ui);
    if (solved) {
      player.addItem(createStudyKey());
    }
  }

  /**
   * Port of C++ GameController MEMORY GOBLET inspect branch.
   */
  private async handleMemoryGoblet(player: Player): Promise<void> {
    if (this.memoryGobletIsActive) {
      this.ui.displayPrompt(
        "You dunk your head into the goblet and you are granted SIGHT.",
      );
      player.addItem(createSight());
      await this.ui.userInput();
      return;
    }

    if (player.inInventory("YOUR MEMORY")) {
      this.ui.displayPrompt(
        "You place YOUR MEMORY into the MEMORY GOBLET and it unleashes a blue flame as it roars to life.",
      );
      player.useItem("YOUR MEMORY");
      this.memoryGobletIsActive = true;
      await this.ui.userInput();
      return;
    }

    this.ui.displayPrompt(
      "You approch the tank of memories, however you lack the item that must go here... you walk away.",
    );
    await this.ui.userInput();
  }

  /**
   * Remaining puzzle modules not ported yet.
   */
  private async handlePuzzleStub(
    player: Player,
    puzzleId:
      | "gallery"
      | "mirror"
      | "fountain"
      | "maze"
      | "chant"
      | "memory"
      | "greaterLibrary"
      | undefined,
  ): Promise<void> {
    if (puzzleId === "gallery") {
      await this.handleGalleryPuzzle(player);
      return;
    }

    if (puzzleId === "mirror") {
      await this.handleMirrorPuzzle(player);
      return;
    }

    if (puzzleId === "fountain") {
      await this.handleFountainPuzzle(player);
      return;
    }

    if (puzzleId === "maze") {
      await this.handleMazePuzzle(player);
      return;
    }

    if (puzzleId === "chant") {
      await this.handleChantPuzzle(player);
      return;
    }

    if (puzzleId === "memory") {
      await this.handleMemoryPuzzle(player);
      return;
    }

    if (puzzleId === "greaterLibrary") {
      await this.handleGreaterLibraryPuzzle(player);
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
    await this.pickUpNamedItem(player, currentRoom, itemName);
  }

  private async pickUpNamedItem(
    player: Player,
    currentRoom: Room,
    itemName: string,
  ): Promise<void> {
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

    // C++: picking up C4 in HEDGE MAZE EXIT teleports to RITUAL ROOM.
    if (itemName === "CANDLE" && currentRoom.getName() === "HEDGE MAZE EXIT") {
      this.ui.clear();
      this.ui.displayPrompt(
        "As you pick up the 4th candle, a surge of energy flows through the room...",
      );
      await this.ui.sleep(2000);
      this.ui.displayPrompt(
        "A mysterious portal materializes before you, shimmering with eldritch energy...",
      );
      await this.ui.sleep(2000);
      this.ui.displayPrompt(
        "The portal pulls you in... You are heading to the Ritual Room.",
      );
      const ritual = this.rooms.get("RITUAL ROOM");
      if (ritual) {
        player.setRoom(ritual);
      }
      await this.playTeleportSequence();
      await this.ui.sleep(3000);
      this.ui.clear();
    }
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
      this.updateSanity(player, item.getValue());
      player.useItem("BOTTLE OF PILLS");
      this.ui.displayPrompt(
        "You used the bottle of sanity pills. The world makes a bit more sense again.",
      );
      this.ui.displayPrompt(`Sanity Level: ${player.getSanity()}`);
    }
  }
}
