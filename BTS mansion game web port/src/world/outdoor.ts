import { Door, Item, Room } from "../domain";

export function createHolyWater(): Item {
  return Item.key(
    "HOLY WATER",
    "Pristine bottle of blessed water",
    "MAZEKEY",
    true,
    true,
  );
}

export function createMazeMap(): Item {
  return Item.key(
    "MAZE MAP",
    "Map outlining the layout of the maze, able to lead you to the exit.",
    "MAZEEXITKEY",
    true,
    true,
  );
}

export function createCandle4(): Item {
  return Item.key(
    "CANDLE",
    "The fourth CANDLE, one more until you're finally out of this nightmare.",
    "C4",
    true,
    true,
  );
}

/**
 * Outdoor / garden wing from C++ GameControllerClass.cpp (Phase 5c).
 */
export function buildOutdoorWorld(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const blockedMazeDoor = new Door(
    true,
    "MAZEKEY",
    "You pour the holy water on the dark force blocking the entrance to the hedge maze, granting yourself access as the dark sludge burns away.",
    "BLOCKED HEDGE MAZE",
  );

  const mazeExitDoor = () =>
    new Door(
      true,
      "MAZEEXITKEY",
      "Using the map, you are able to find your way out of the maze, reaching the exit.",
      "MAZE EXIT",
    );

  const shedBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "a BOTTLE OF PILLS with a faded label",
    50,
    true,
    true,
  );

  const fountainPanel = Item.interactable(
    "FOUNTAIN PANEL",
    "A FOUNTAIN PANEL in the base of the fountain seems like you could push it like a button...",
    false,
    {
      kind: "puzzle",
      puzzleId: "fountain",
      inputMessage: "Do you want to begin the Fountain Puzzle? (YES or NO)",
      outputMessage: "Test",
    },
  );

  const lantern = Item.interactable(
    "LANTERN",
    "A LANTERN to help you see while exploring the maze...",
    false,
    {
      kind: "puzzle",
      puzzleId: "maze",
      inputMessage:
        "You should explore the maze, paying attention to your surrondings, do you want to explore? (YES or NO)",
      outputMessage: "Test",
    },
  );

  rooms.set(
    "GARDEN",
    new Room({
      description:
        "You step outside into a serene garden, filled with vibrant flowers and lush greenery. The moon shines brightly above, and you can hear the gentle rustling of leaves in the breeze. There's a feeling of tranquility here, but also an underlying sense of mystery, as if the garden holds secrets waiting to be uncovered.",
      name: "GARDEN",
      exits: ["SHED", "FOUNTAIN", "BLOCKED HEDGE MAZE"],
      doors: [blockedMazeDoor],
      items: [],
    }),
  );

  rooms.set(
    "SHED",
    new Room({
      description:
        "You enter a small, dusty shed filled with various gardening tools and supplies. The air is thick with the smell of soil and wood. A single window allows a sliver of moonlight to illuminate the cobwebs in the corners.",
      name: "SHED",
      exits: ["GARDEN"],
      items: [shedBottle],
    }),
  );

  rooms.set(
    "FOUNTAIN",
    new Room({
      description:
        "You arrive at a beautifully ornate fountain, its waters sparkling in the sunlight. The sound of water gently cascading down creates a soothing atmosphere. Surrounding the fountain are blooming flowers and lush greenery, adding to the serenity of the space.",
      name: "FOUNTAIN",
      exits: ["GARDEN"],
      items: [fountainPanel],
    }),
  );

  rooms.set(
    "HEDGE MAZE",
    new Room({
      description:
        "You find yourself in a sprawling hedge maze. Tall hedges tower around you, creating a sense of disorientation. The paths are winding, and the sound of rustling leaves fills the air. You sense that there might be hidden corners to explore.",
      name: "HEDGE MAZE",
      exits: ["GARDEN", "MAZE EXIT"],
      doors: [mazeExitDoor()],
      items: [lantern],
    }),
  );

  rooms.set(
    "HEDGE MAZE EXIT",
    new Room({
      description:
        "You exit the hedge maze into a small clearing with a bird fountain, this place seems very calm, almost safe.",
      name: "HEDGE MAZE EXIT",
      exits: ["HEDGE MAZE"],
      doors: [mazeExitDoor()],
      items: [createCandle4()],
    }),
  );

  return rooms;
}
