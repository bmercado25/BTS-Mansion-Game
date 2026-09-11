import { Door, Item, Room } from "../domain";

/**
 * Downstairs mansion content from C++ GameControllerClass.cpp (Phase 5a).
 */
export function buildDownstairsWorld(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const makeLibraryDoor = () =>
    new Door(
      true,
      "BBBB",
      "You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move.A dim eeries light illuminates the room, as you stand here in feeling the chill of the cold and heavy air surronding you.There also appears to be a ornate wooden DOOR that is locked",
      "DOOR",
    );

  const makeBookshelfDoor = () =>
    new Door(
      true,
      "BookKey",
      "You enter the library, filled to the brim with bookshelves.",
      "BOOKSHELF",
    );

  const makeGreaterLibraryDoor = () =>
    new Door(
      true,
      "DHKey",
      "You have now opened the door, you are now in the GREATER LIBRARY",
      "GREATER LIBRARY DOOR",
    );

  const statue = Item.interactable(
    "STATUE",
    "a STATUE of a woman carrying a book",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to INTERACT with the statue?",
      outputMessage:
        "You feel a wave of knowledge wash over you, like you've learned something from someone previously here before you.",
    },
  );

  const noteA = Item.note("NOTE A", "A note with dust and cobwebs all over", true);

  const rustyKey = Item.key("RUSTY KEY", "a RUSTY KEY", "BBBB", true, true);
  const loungeBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "a BOTTLE OF PILLS with a faded label",
    50,
    true,
    true,
  );

  const oldBook = Item.key(
    "OLD BOOK",
    "an OLD BOOK which appears to belong to a bookshelf",
    "BookKey",
    true,
    true,
  );

  const greaterLibraryBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "a BOTTLE OF PILLS with a faded label",
    50,
    true,
    true,
  );

  const studyCandle = Item.key(
    "CANDLE",
    "A CANDLE with a pentagram design",
    "C2",
    true,
    true,
  );

  const candle1 = Item.key(
    "CANDLE",
    "A CANDLE with pentagram etchings",
    "C1",
    true,
    true,
  );

  const metalSafe = Item.interactable(
    "METAL SAFE",
    "A safe that appears to accept a 4 digit code",
    false,
    {
      kind: "safe",
      inputMessage: "Would you like to look at the safe?",
      outputMessage: "Please enter a 4 digit code",
    },
  );

  const deadBody1 = Item.interactable(
    "DEAD BODY 1",
    "A dead body with a red shirt with a number 8 on and has his mouth open",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 1?",
      outputMessage: "A dead body with a red shirt numbered 8 — mouth open.",
    },
  );
  const deadBody2 = Item.interactable(
    "DEAD BODY 2",
    "A dead body with a blue shirt with a number 6 on and has his skull cracked open",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 2",
      outputMessage: "A dead body with a blue shirt numbered 6 — skull cracked open.",
    },
  );
  const deadBody3 = Item.interactable(
    "DEAD BODY 3",
    "A dead body with a green shirt with a number 9 on and has his hands on the floor",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 3",
      outputMessage: "A dead body with a green shirt numbered 9 — hands on the floor.",
    },
  );
  const deadBody4 = Item.interactable(
    "DEAD BODY 4",
    "A dead body with a purple shirt with a number 1 on and has his right leg over his left leg",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 4",
      outputMessage: "A dead body with a purple shirt numbered 1 — right leg over left.",
    },
  );

  const kitchenCounter = Item.interactable(
    "KITCHEN COUNTER",
    "The kitchen counter has different colors as its design, it red as its first color, then blue, green, and purple",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at the kitchen counter?",
      outputMessage:
        "The counter colors read red, then blue, green, and purple — matching shirts on the dining hall bodies?",
    },
  );

  const kitchenBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "a BOTTLE OF PILLS with a faded label",
    50,
    true,
    true,
  );

  rooms.set(
    "FOYER",
    new Room({
      description:
        "You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move. A dim eeries light illuminates the room, as you stand here in feeling the chill of the cold and heavy air surronding you. There also appears to be a ornate wooden DOOR that is locked.\n",
      name: "FOYER",
      exits: ["LOUNGE", "DOOR", "KITCHEN DOOR"],
      doors: [makeLibraryDoor()],
      items: [noteA, statue],
    }),
  );

  rooms.set(
    "LIBRARY",
    new Room({
      description: "You enter the library, filled to the brim with bookshelves.\n",
      name: "LIBRARY",
      exits: ["FOYER", "BOOKSHELF", "GREATER LIBRARY DOOR"],
      doors: [makeBookshelfDoor(), makeLibraryDoor(), makeGreaterLibraryDoor()],
      items: [oldBook],
    }),
  );

  rooms.set(
    "LOUNGE",
    new Room({
      description:
        "You enter the lounge, There is a staircase, however there is a black sludge blocking the way\n",
      name: "LOUNGE",
      exits: ["FOYER", "DINING HALL DOOR"],
      items: [rustyKey, loungeBottle],
    }),
  );

  rooms.set(
    "GREATER LIBRARY",
    new Room({
      description:
        "You are now in the greater library, many books and shelves are around and there seems to be a door leading to another room to a office , you must solve the puzzle to enter!!",
      name: "GREATER LIBRARY",
      exits: ["LIBRARY", "PUZZLE"],
      items: [greaterLibraryBottle],
    }),
  );

  rooms.set(
    "STUDY",
    new Room({
      description:
        "You enter the study, the walls are dark brown with shelfs full of books and paper scrolls. There is a desk that is rather neat and organize. Behind the desk is grand portrait of a man with a stern face, eyes so dark its you uncomfortable.The man's finger is pointing to what seems to be a cabinet and on behind a pile of books you see a candle.",
      name: "STUDY",
      exits: ["GREATER LIBRARY"],
      items: [studyCandle],
    }),
  );

  rooms.set(
    "RITUAL ROOM",
    new Room({
      description:
        "You enter a room that does not invite you back. A perfect, pentacle drawn on the floor invites you to place a candle at each of it's vertecies. [Hint: enter CANDLE as input if you posses a candle]",
      name: "RITUAL ROOM",
      exits: ["HIDDEN SECTION"],
      isRitual: true,
    }),
  );

  rooms.set(
    "HIDDEN SECTION",
    new Room({
      description:
        "You now enter the hidden section, nothing is safe here, you feel a presense linger, as if it was plucking your heartstrings, there is a table with a candle on top",
      name: "HIDDEN SECTION",
      exits: ["LIBRARY", "RITUAL ROOM"],
      items: [candle1],
    }),
  );

  rooms.set(
    "DINING HALL",
    new Room({
      description:
        "You are now in the Dining Hall. There is a large table and chairs. From here, you can go to the kitchen.\n",
      name: "DINING HALL",
      exits: ["DINING HALL DOOR", "KITCHEN"],
      items: [metalSafe, deadBody1, deadBody2, deadBody3, deadBody4],
    }),
  );

  rooms.set(
    "KITCHEN",
    new Room({
      description:
        "You are now in the Kitchen,You can return to the dining hall from here.\n",
      name: "KITCHEN",
      exits: ["DINING HALL", "KITCHEN DOOR"],
      items: [kitchenCounter, kitchenBottle],
    }),
  );

  return rooms;
}

/** Key awarded when dining hall safe opens (C++ diningHallKey). */
export function createDiningHallKey(): Item {
  return Item.key(
    "DINING HALL KEY",
    "A Shiny DINING HALL KEY with grapes on the handle,it appears to open the greater library",
    "DHKey",
    true,
    true,
  );
}
