import { Door, Item, Room } from "../domain";

export function createHolyWater(): Item {
  return Item.key(
    "HOLY WATER",
    "A pristine bottle of blessed water.",
    "MAZEKEY",
    true,
    true,
  );
}

export function createMazeMap(): Item {
  return Item.key(
    "MAZE MAP",
    "A map outlining the layout of the maze that can lead you to the exit.",
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
 * Outdoor / garden wing from latest C++ (R2: graveyard, shed hide, newspaper).
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
    "A BOTTLE OF PILLS with a faded label.",
    50,
    true,
    true,
  );

  const journal5 = Item.note(
    "JOURNAL 5",
    "A crumpled page which reads JOURNAL 5: Layla is dead. Henry killed her and my poor son Joseph. I found her journal and felt I shouldn't leave it without an ending. What did I do to deserve this? Henry's son, Lester sent me a letter that he would come visit in light of recent events from the past month. I hope to learn what happened to Henry and get some closure.",
    true,
  );

  const newspaperClipping = Item.note(
    "NEWSPAPER CLIPPING",
    "A NEWSPAPER CLIPPING with headline Mansion Murder! Crane Smith murdered in his new Mansion two months after his family were murdered. Rumors are the son of first murderer, HENRY JENKINS, whose named LESTER JENKINS, was the killer. However, nothing has been confirmed as of late.",
    true,
  );

  const fountainPanel = Item.interactable(
    "FOUNTAIN PANEL",
    "A FOUNTAIN PANEL is at the base of the fountain, it seems like you could push it as if it were a button...",
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
    "A LANTERN to help you see while you are exploring the maze...",
    false,
    {
      kind: "puzzle",
      puzzleId: "maze",
      inputMessage:
        "You should explore the maze, paying attention to your surroundings, do you want to explore? (YES or NO)",
      outputMessage: "Test",
    },
  );

  const tombstone = (n: number, output: string) =>
    Item.interactable(`TOMBSTONE ${n}`, "", false, {
      kind: "message",
      inputMessage: `Would you like to look at tombstone ${n}?`,
      outputMessage: output,
    });

  rooms.set(
    "GARDEN",
    new Room({
      description:
        "You step outside into a serene garden, filled with vibrant flowers and lush greenery. The moon shines brightly above and you can hear the gentle rustling of leaves in the breeze. There's a feeling of tranquility here, but also an underlying sense of mystery, as if the garden holds secrets waiting to be uncovered.",
      name: "GARDEN",
      exits: ["SHED", "FOUNTAIN", "BLOCKED HEDGE MAZE", "GRAVEYARD"],
      doors: [blockedMazeDoor],
      items: [],
    }),
  );

  rooms.set(
    "GRAVEYARD",
    new Room({
      description:
        "You enter a shadowy graveyard with headstones scattered across the mist-covered ground. The air is thick with an eerie silence, broken only by the distant hoot of an owl. A chill runs down your spine as you realize this place holds secrets long forgotten.",
      name: "GRAVEYARD",
      exits: ["GARDEN"],
      items: [
        tombstone(1, "The engraving is too worn to read."),
        tombstone(2, "The engraving is too worn to read."),
        tombstone(3, "The engraving is too worn to read."),
        tombstone(4, "The engraving is too worn to read."),
      ],
    }),
  );

  rooms.set(
    "SHED CLOSET",
    new Room({
      description: "You are in the shed closet. You are safe from any threats.",
      name: "SHED CLOSET",
      exits: ["SHED"],
      isSafe: true,
    }),
  );

  rooms.set(
    "SHED",
    new Room({
      description:
        "You enter a small, dusty shed filled with various gardening tools and supplies. The air is thick with the smell of soil and wood. A single window allows a sliver of moonlight to illuminate the cobwebs in the corners. There is a small closet can be used to hide from the monster.",
      name: "SHED",
      exits: ["GARDEN", "SHED CLOSET"],
      items: [shedBottle, journal5],
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
        "You find yourself in a sprawling hedge maze. Tall hedges tower around you, creating a sense of disorientation. The paths are winding and the sound of rustling leaves fills the air. You sense that there might be hidden corners to explore.",
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
        "You exit the hedge maze into a small clearing with a bird fountain. This place seems very calm, almost safe.",
      name: "HEDGE MAZE EXIT",
      exits: ["HEDGE MAZE"],
      doors: [mazeExitDoor()],
      items: [createCandle4(), newspaperClipping],
    }),
  );

  return rooms;
}
