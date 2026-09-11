import { Item, Room } from "../domain";

export function createCandle5(): Item {
  // C++ uses expire ctor (no key id); we tag C5 so ritual placement works.
  return Item.key("CANDLE", "The 5th and Final Candle", "C5", true, true);
}

/**
 * Memory-wing shell + chant letter rooms so CHANTING ALTAR is reachable.
 * Full Sight / MemoryPuzzle content arrives in Phase 7f.
 * Entry opens from the ritual room after placing C4 (C++ has no main-map entrance).
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
