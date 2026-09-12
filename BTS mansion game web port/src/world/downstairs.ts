import { Door, Item, Room } from "../domain";

/**
 * Downstairs mansion content from latest C++ GameControllerClass.cpp.
 */
export function buildDownstairsWorld(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const makeLibraryDoor = () =>
    new Door(
      true,
      "BBBB",
      "You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move. A dim eerie light illuminates the room, as you stand here feeling the chill of the cold and heavy air surrounding you. There also appears to be an ornate wooden DOOR that is locked",
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

  const makeStudyDoor = () =>
    new Door(
      true,
      "STUDYKEY",
      "You unlock the door with the study key, unlocking the study.",
      "STUDY DOOR",
    );

  const statue = Item.interactable(
    "STATUE",
    "A STATUE of a woman carrying a book.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to INTERACT with the statue?",
      outputMessage:
        "You feel a wave of knowledge wash over you, like you've learned something from someone previously here before you.",
    },
  );

  const noteA = Item.note(
    "NOTE A",
    "A NOTE with dust and cobwebs all over. It reads: Welcome to the Mansion.",
    true,
  );

  const rustyKey = Item.key(
    "RUSTY KEY",
    "A RUSTY KEY, it looks very fragile and brittle.",
    "BBBB",
    true,
    true,
  );
  const loungeBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "A BOTTLE OF PILLS with a faded label.",
    50,
    true,
    true,
  );

  const oldBook = Item.key(
    "OLD BOOK",
    "An OLD BOOK, it appears to belong to a bookshelf.",
    "BookKey",
    true,
    true,
  );

  const greaterLibraryBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "A BOTTLE OF PILLS with a faded label.",
    50,
    true,
    true,
  );

  const studyCandle = Item.key(
    "CANDLE",
    "A CANDLE with a pentagram design.",
    "C2",
    true,
    true,
  );

  const candle1 = Item.key(
    "CANDLE",
    "A CANDLE with pentagram etchings.",
    "C1",
    true,
    true,
  );

  const journal1 = Item.note(
    "JOURNAL 1",
    "A dusty page which reads JOURNAL 1: Henry and Crane went out last night. Crane had a stupendous time and I am glad that he has such a reliable friend.",
    true,
  );

  const journal2 = Item.note(
    "JOURNAL 2",
    "A torn page which reads JOURNAL 2: Apparently my beloved husband Crane is related to some wealthy English family and they are coming to America! They already sent some gifts that are extravagant and they are offering Crane a very wealthy position in their family. This is amazing!",
    true,
  );

  const bathroomNote = Item.note(
    "BATHROOM NOTE",
    "A faded BATHROOM NOTE, scribbled with hurried handwriting. It reads:'The mirror is the key to the next step. Look closely.'",
    true,
  );

  const ballroomNote = Item.note(
    "BALLROOM NOTE",
    "A handwritten note left behind, detailing strange occurrences during the last grand ball.",
    true,
  );

  const gBook1 = Item.interactable(
    "PRISTINE BOOK",
    "A PRISTINE BOOK with a picture of a king on his throne.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to read the book?",
      outputMessage:
        "This book tells the story of a king who began a Dangerous journey across all of the lands.",
    },
  );
  const gBook2 = Item.interactable(
    "GRASSY BOOK",
    "A GRASSY BOOK with a picture of a king in the woods.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to read the book?",
      outputMessage:
        "This book describes a king struggling to survive during the beginning of his jOurney.",
    },
  );
  const gBook3 = Item.interactable(
    "WOODEN BOOK",
    "A WOODEN BOOK with a picture of a king entering a town.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to read the book?",
      outputMessage:
        "This book tells the tale of a king reaching his first town, and seeing the poverty of the people in his domain firsthanD",
    },
  );
  const gBook4 = Item.interactable(
    "DIRTY BOOK",
    "A DIRTY BOOK with a picture of a king sitting in the dirt.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to read the book?",
      outputMessage:
        "This book describes a king having to beg alongside beGgars, selling his crown for food.",
    },
  );
  const gBook5 = Item.interactable(
    "TATTERED BOOK",
    "A TATTERED BOOK with a picture of a corpse.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to read the book?",
      outputMessage:
        "This book shows an image of a corpse lying dEad in the wilderness, royal cape tattered.",
    },
  );

  // GreaterLibraryPuzzle — answer DODGE (clue books capitalize D-O-D-G-E).
  const wordLock = Item.interactable(
    "WORD LOCK",
    "A WORD LOCK which takes a 5 letter word.",
    false,
    {
      kind: "puzzle",
      puzzleId: "greaterLibrary",
      inputMessage: "Would you like to INTERACT with the lock?",
      outputMessage: "",
    },
  );

  const metalSafe = Item.interactable(
    "METAL SAFE",
    "A safe that appears to accept a 4 digit code.",
    false,
    {
      kind: "safe",
      inputMessage: "Would you like to look at the safe?",
      outputMessage: "Please enter the correct 4-digit code.",
    },
  );

  const deadBody1 = Item.interactable(
    "DEAD BODY 1",
    "A dead body with a red shirt and has his mouth open.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 1?",
      outputMessage: "You touched the shirt and it revealed the number 8.",
    },
  );
  const deadBody2 = Item.interactable(
    "DEAD BODY 2",
    "A dead body with a blue shirt and has his skull cracked open.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 2",
      outputMessage: "You touched the shirt and it revealed the number 6.",
    },
  );
  const deadBody3 = Item.interactable(
    "DEAD BODY 3",
    "A dead body with a green shirt and has his hands on the floor.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 3",
      outputMessage: "You touched the shirt and it revealed the number 9.",
    },
  );
  const deadBody4 = Item.interactable(
    "DEAD BODY 4",
    "A dead body with a purple shirt and has his right leg over his left leg.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at dead body 4",
      outputMessage: "You touched the shirt and it revealed the number 1.",
    },
  );

  const kitchenCounter = Item.interactable(
    "KITCHEN COUNTER",
    "a kithchen counter with multiple colors",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to look at the kitchen counter?",
      outputMessage:
        "The kitchen counter has a striped design with four different coloed. The first color is red, then its blue, green, and purple.",
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
        "You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move. A dim eerie light illuminates the room as you stand there feeling the chill of the cold and heavy air surrounding you. On the floor there is a bloody butler's suit. There also appears to be an ornate wooden DOOR that is locked.\n",
      name: "FOYER",
      exits: ["LOUNGE", "DOOR", "KITCHEN DOOR", "GUESTROOM"],
      doors: [makeLibraryDoor()],
      items: [noteA, statue],
    }),
  );

  rooms.set(
    "GUESTROOM",
    new Room({
      description:
        "The guestroom is modest yet elegant, with a large bed covered in fine linens and a single window overlooking the mansion grounds. Awardrobe stands in one corner and a small desk is positioned near the bed. The air feels slightly colder here as if the room hasn't been used in a while.",
      name: "GUESTROOM",
      exits: ["FOYER"],
      items: [journal1],
    }),
  );

  rooms.set(
    "LIBRARY TABLE",
    new Room({
      description: "You are under the table. You are safe from any threats.",
      name: "LIBRARY TABLE",
      exits: ["LIBRARY"],
      isSafe: true,
    }),
  );

  rooms.set(
    "LIBRARY",
    new Room({
      description: "You enter the library, filled to the brim with bookshelves.\n",
      name: "LIBRARY",
      exits: ["FOYER", "BOOKSHELF", "GREATER LIBRARY DOOR", "LIBRARY TABLE"],
      doors: [makeBookshelfDoor(), makeLibraryDoor(), makeGreaterLibraryDoor()],
      items: [oldBook],
    }),
  );

  rooms.set(
    "LOUNGE CLOSET",
    new Room({
      description: "You are in the lounge closet. You are safe from any threats.",
      name: "LOUNGE CLOSET",
      exits: ["LOUNGE"],
      isSafe: true,
    }),
  );

  rooms.set(
    "LOUNGE",
    new Room({
      description:
        "You enter the lounge and there is a staircase, however there is a black sludge blocking the way. There are two blood stains that seem to be from two murder victims that stain the carpet.\n",
      name: "LOUNGE",
      exits: ["FOYER", "DINING HALL DOOR", "BATHROOM", "LOUNGE CLOSET"],
      items: [rustyKey, loungeBottle],
    }),
  );

  rooms.set(
    "BATHROOM",
    new Room({
      description:
        "The bathroom is dimly lit, with a large, ornate mirror above a marble sink. A clawfoot tub stands in the corner, its porcelain surface chipped, while faded towels hang on a rack nearby. The air is thick with the smell of dampness and the floor creaks underfoot as if the room is in disrepair.",
      name: "BATHROOM",
      exits: ["LOUNGE"],
      items: [bathroomNote],
    }),
  );

  rooms.set(
    "GREATER LIBRARY",
    new Room({
      description:
        "You are now in the greater library. There many books and shelves around and there seems to be a door leading to another room to an office.",
      name: "GREATER LIBRARY",
      exits: ["LIBRARY", "BALLROOM", "STUDY DOOR"],
      doors: [makeStudyDoor()],
      items: [greaterLibraryBottle, wordLock, gBook4, gBook1, gBook2, gBook5, gBook3],
    }),
  );

  rooms.set(
    "BALLROOM",
    new Room({
      description:
        "The grand ballroom is magnificent, with a chandelier hanging overhead and rows of windows draped in heavy, velvet curtains. The polished marble floors reflect the moonlight streaming through the windows, but there's an eerie silence, as if the ghosts of past parties linger in the shadows.",
      name: "BALLROOM",
      exits: ["GREATER LIBRARY"],
      items: [ballroomNote],
    }),
  );

  rooms.set(
    "STUDY DESK",
    new Room({
      description: "You are under the study desk. You are safe from any threats.",
      name: "STUDY DESK",
      exits: ["STUDY"],
      isSafe: true,
    }),
  );

  rooms.set(
    "STUDY",
    new Room({
      description:
        "You enter the study, the walls are dark brown with shelfs full of books and paper scrolls. There is a desk that is rather neat and organize. Behind the desk is grand portrait of a man with a stern face, eyes so dark its makes you uncomfortable. The man's finger is pointing to what seems to be a cabinet and behind a pile of books you see a candle.",
      name: "STUDY",
      exits: ["GREATER LIBRARY", "STUDY DESK"],
      items: [studyCandle],
    }),
  );

  rooms.set(
    "RITUAL ROOM",
    new Room({
      description:
        "You enter a room that does not invite you back. A perfect, pentacle drawn on the floor invites you to place a candle at each of it's vertecies. [Hint: enter CANDLE as input if you posses a candle].",
      name: "RITUAL ROOM",
      exits: ["HIDDEN SECTION"],
      isRitual: true,
    }),
  );

  rooms.set(
    "HIDDEN SECTION",
    new Room({
      description:
        "You now enter the hidden section, nothing is safe here and you feel a presence linger as if it was plucking your heartstrings. There is a table with a candle on top.",
      name: "HIDDEN SECTION",
      exits: ["LIBRARY", "RITUAL ROOM"],
      items: [candle1, journal2],
    }),
  );

  rooms.set(
    "DINING TABLE",
    new Room({
      description:
        "You are under the dining table. You are safe from any threats.",
      name: "DINING TABLE",
      exits: ["DINING HALL"],
      isSafe: true,
    }),
  );

  rooms.set(
    "DINING HALL",
    new Room({
      description:
        "You are now in the Dining Hall. There are chairs and a large table which can be used for hiding from the monster. From here you can go to the kitchen.\n",
      name: "DINING HALL",
      exits: ["DINING HALL DOOR", "KITCHEN", "DINING TABLE"],
      items: [metalSafe, deadBody1, deadBody2, deadBody3, deadBody4],
    }),
  );

  rooms.set(
    "PANTRY",
    new Room({
      description: "You are in the pantry. You are safe from any threats.",
      name: "PANTRY",
      exits: ["KITCHEN"],
      isSafe: true,
    }),
  );

  rooms.set(
    "KITCHEN",
    new Room({
      description:
        "You are now in the Kitchen. There is a pantry closet that can be used to hide from the monster. You can return to the dining hall from here.\n",
      name: "KITCHEN",
      exits: ["DINING HALL", "KITCHEN DOOR", "PANTRY"],
      items: [kitchenCounter, kitchenBottle],
    }),
  );

  return rooms;
}

/** Key from dining hall safe (C++ greaterLibraryKey). */
export function createDiningHallKey(): Item {
  return Item.key(
    "GREATER LIBRARY KEY",
    "A Shiny GREATER LIBRARY KEY with grapes on the handle,it appears to open the greater library",
    "DHKey",
    true,
    true,
  );
}

/** Reward for Greater Library WORD LOCK (C++ studyKey). */
export function createStudyKey(): Item {
  return Item.key(
    "STUDY KEY",
    "An ornate key with lines of text scribbled on it.",
    "STUDYKEY",
    true,
    true,
  );
}
