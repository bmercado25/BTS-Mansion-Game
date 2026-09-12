import { Item, Room } from "../domain";

export function createCandle5(): Item {
  return Item.key("CANDLE", "The 5th and Final Candle.", "C5", true, true);
}

export function createPlayerMemory(): Item {
  return Item.key(
    "YOUR MEMORY",
    "A glowing orb, reminiscent of your past.",
    "YOURMEMORY",
    true,
    true,
  );
}

export function createSight(): Item {
  return new Item({
    name: "SIGHT",
    description: "Allows you to see the unseen.",
    canPickUp: true,
    canExpire: true,
  });
}

/**
 * Memory wing from latest C++ (R2: MEMORY TABLE + updated copy).
 */
export function buildMemoryWing(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const chantingAltar = Item.interactable(
    "CHANTING ALTAR",
    "A CHANTING ALTAR, there appears to be a 4 word phrase engraved on the altar, but it's been scratched away",
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
    "A crystal tank that is labeled as MEMORY TANK. There is a hand imprint on the tank.",
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
    "A transparent chalice with the logo of an eye called the MEMORY GOBLET, a place where memories can be added.",
    false,
    {
      kind: "message",
      inputMessage: "Approach the goblet",
      outputMessage: "You interact with the goblet",
    },
  );

  rooms.set(
    "MEMORY OF THE MANSION",
    new Room({
      description:
        "You arrive in a broken mansion, it looks familiar but different. It is the mansion from the monster's memories. You are no longer in your reality, but a twisted one where the mansion has been destroyed and its debris are lingering in the air. There are portraits and pieces of the staircase floating in the air with a pink nebula in the background.",
      name: "MEMORY OF THE MANSION",
      exits: [
        "MEMORY TABLE",
        "MEMORY OF THE FOYER",
        "MEMORY OF THE LIBRARY",
        "MEMORY OF THE GARDEN",
        "MEMORY OF THE STUDY",
        "THE LIFT",
        "THE CONSCIOUS",
      ],
      items: [],
    }),
  );

  rooms.set(
    "MEMORY TABLE",
    new Room({
      description:
        "You are now under the table. You are safe from any threats.",
      name: "MEMORY TABLE",
      exits: ["MEMORY OF THE MANSION"],
      isSafe: true,
    }),
  );

  rooms.set(
    "MEMORY OF THE FOYER",
    new Room({
      description:
        "You arrive at a broken foyer and you can see a floating statue and doors that are floating away from their hinges. Apparitions of a family of f!?o^ur@ with their eyes blacked out watch you. You see the text UROTMU which appears to be scrambled.",
      name: "MEMORY OF THE FOYER",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive at a broken foyer and you can see a floating statue and doors that are floating away from their hinges. Apparitions of a family of f!?o^ur@ with their eyes blacked out watch you. Adjacent to this room is MEMORY OF THE MANSION. The letters re-arrange to form: TUORUM.",
    }),
  );

  rooms.set(
    "MEMORY OF THE LIBRARY",
    new Room({
      description:
        "You arrive at a broken library, books and bookshelves are floating around. There is a woman lying on the floor with t$hr#@ee darts in her head. You see the text OACPMEURTC which appears to be scrambled.",
      name: "MEMORY OF THE LIBRARY",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive at a broken library, books and bookshelves are floating around. There is a woman lying on the floor with t$hr#@ee darts in her head. The letters re-arrange to form: PECCATORUM.",
    }),
  );

  rooms.set(
    "MEMORY OF THE GARDEN",
    new Room({
      description:
        "You arrive at a broken garden, the grass is no longer green and the hedge maze has been burnt away. There is o!(ne& figure all in black digging a gravestone with your name on it. You see the text GNXUIEET which appears to be scrambled.",
      name: "MEMORY OF THE GARDEN",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive at a broken garden. There is o!(ne& figure all in black digging a gravestone with your name on it. Adjacent to this room is MEMORY OF THE MANSION. The letters re-arrange to form: EXTINGUE.",
    }),
  );

  rooms.set(
    "MEMORY OF THE STUDY",
    new Room({
      description:
        "You arrive at a broken study. On the desk sits a revolver with blood all around, as %t^w*o men lie lifeless on the desk with holes in their heads. You see the letters LMMMFAA.",
      name: "MEMORY OF THE STUDY",
      exits: ["MEMORY OF THE MANSION"],
      items: [],
      hasConditionalDescription: true,
      conditionalDescription:
        "You arrive at a broken study. On the desk sits a revolver with blood all around, as %t^w*o men lie lifeless on the desk with holes in their heads. Adjacent to this room is MEMORY OF THE MANSION. The letters re-arrange to form: FLAMMAM.",
    }),
  );

  rooms.set(
    "THE LIFT",
    new Room({
      description:
        "The beam of energy carries your body up to a place that is unrecognizable, it appears to be an attic.",
      name: "THE LIFT",
      exits: ["MEMORY OF THE MANSION"],
      items: [memoryTank],
    }),
  );

  rooms.set(
    "THE CONSCIOUS",
    new Room({
      description:
        "You enter a new room that looks nothing like the mansion. It has an evil influence, as if you were inside the conscious of the monster itself.",
      name: "THE CONSCIOUS",
      exits: ["MEMORY OF THE MANSION"],
      items: [memoryGoblet, chantingAltar],
    }),
  );

  return rooms;
}
