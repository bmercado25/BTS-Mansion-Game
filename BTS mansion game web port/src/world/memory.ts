import { Item, Room } from "../domain";

export function createCandle5(): Item {
  // C++ uses expire ctor (no key id); we tag C5 so ritual placement works.
  return Item.key("CANDLE", "The 5th and Final Candle", "C5", true, true);
}

export function createPlayerMemory(): Item {
  return Item.key(
    "YOUR MEMORY",
    "a glowing orb, reminiscent of your past",
    "YOURMEMORY",
    true,
    true,
  );
}

export function createSight(): Item {
  // C++ expire ctor (pickUp + expire); not a key, not consumable.
  return new Item({
    name: "SIGHT",
    description: "Allows you to see the unseen",
    canPickUp: true,
    canExpire: true,
  });
}

/**
 * Memory wing: letter rooms (Sight reveals chant words), THE LIFT (MemoryPuzzle),
 * THE CONSCIOUS (goblet + chant altar). Entry opens from ritual after C4.
 */
export function buildMemoryWing(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const chantingAltar = Item.interactable(
    "CHANTING ALTAR",
    "A CHANTING ALTAR, there appears to be a 4 word phrase ingraved on the altar, but its been scrached away",
    false,
    {
      kind: "puzzle",
      puzzleId: "chant",
      inputMessage: "A chanting altar",
      outputMessage: "Test",
    },
  );

  const memoryTank = Item.interactable(
    "MEMORY TANK",
    "A crystal tank, that is labeled as MEMORY TANK. There is a hand inprint on the tank",
    false,
    {
      kind: "puzzle",
      puzzleId: "memory",
      inputMessage: "A memory tank",
      outputMessage: "Test",
    },
  );

  const memoryGoblet = Item.interactable(
    "MEMORY GOBLET",
    "A transparent challice called the MEMORY GOBLET, a place where memories can be added",
    false,
    {
      kind: "message",
      inputMessage: "Approch the goblet",
      outputMessage: "You interact with the goblet",
    },
  );

  rooms.set(
    "MEMORY OF THE MANSION",
    new Room({
      description:
        "You arrive in a broken mansion, it looks familiar but different. Its the mansion from the memories of the monster. You are no longer in your reality, but a twisted one where the mansion has been destroyed, and its debris are lingering in the air. There are portraits and pieces of staircase floating in the air with a pink nebula in the background",
      name: "MEMORY OF THE MANSION",
      exits: [
        "MEMORY OF THE FOYER",
        "MEMORY OF THE LIBRARY",
        "MEMORY OF THE GARDEN",
        "MEMORY OF THE STUDY",
        "THE LIFT",
        "THE CONSCIOUS",
        "RITUAL ROOM",
      ],
      items: [],
    }),
  );

  rooms.set(
    "MEMORY OF THE FOYER",
    new Room({
      description:
        "You arrive to a broken foyer, you an see a floating statue and doors that are floating away from their hinges.(TEMPORARY TEXT: This is room 4 of 4.) You see the text UROTMU which appears to be scrambled.",
      name: "MEMORY OF THE FOYER",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive to a broken foyer, you an see a floating statue and doors that are floating away from their hinges. (TEMPORARY TEXT: This is room 4 of 4.) Adjecent to this room is MEMORY OF THE MANSION The letters re-arrange to form TUORUM.",
    }),
  );

  rooms.set(
    "MEMORY OF THE LIBRARY",
    new Room({
      description:
        "You arrive to a broken library, books and bookshelfs are floating around. (TEMPORARY TEXT: This is room 3 of 4.).  You see the text OACPMEURTC which appears to be scrambled.",
      name: "MEMORY OF THE LIBRARY",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive to a broken library, books and bookshelfs are floating around. (TEMPORARY TEXT: This is room 3 of 4.) The letters re arrange to form: PECCATORUM",
    }),
  );

  rooms.set(
    "MEMORY OF THE GARDEN",
    new Room({
      description:
        "You arrive to a broken garden, the grass is no longer green, and the hedgmaze has been burnt away. (TEMPORARY TEXT: This is room 1 of 4.) You see the text GNXUIEET which appears to be scrambled.",
      name: "MEMORY OF THE GARDEN",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive to a broken study. (TEMPORARY TEXT: This is room 1 of 4.) Adjecent to this room is MEMORY OF THE MANSION The letters re arrange to form: EXTINGUE.",
    }),
  );

  rooms.set(
    "MEMORY OF THE STUDY",
    new Room({
      description:
        "You arrive to a broken study. (TEMPORARY TEXT: This is room 2 of 4.)  You see the letters LMMMFAA.",
      name: "MEMORY OF THE STUDY",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive to a broken study. (TEMPORARY TEXT: This is room 2 of 4.) Adjecent to this room is MEMORY OF THE MANSION The letters re-arrange to form FLAMMAM.",
    }),
  );

  rooms.set(
    "THE LIFT",
    new Room({
      description:
        "The beam of energy carries your body up to place that is unrecognizable, it appears to be an attic",
      name: "THE LIFT",
      exits: ["MEMORY OF THE MANSION"],
      items: [memoryTank],
    }),
  );

  rooms.set(
    "THE CONSCIOUS",
    new Room({
      description:
        "You enter a new room, which looks nothing like the mansion, it has an evil influence, as if you were inside the concious of the monster itself",
      name: "THE CONSCIOUS",
      exits: ["MEMORY OF THE MANSION"],
      items: [memoryGoblet, chantingAltar],
    }),
  );

  return rooms;
}
