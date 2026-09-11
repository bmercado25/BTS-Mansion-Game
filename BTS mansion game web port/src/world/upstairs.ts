import { Door, Item, Room } from "../domain";

/** Half-key / master-key factories used by puzzle stubs + door gating. */
export function createGalleryHalfKey(): Item {
  return new Item({
    name: "GALLERY HALF KEY",
    description: "Half of the key needed to enter the master bedroom.",
    canPickUp: true,
  });
}

export function createMirrorHalfKey(): Item {
  return new Item({
    name: "MIRROR HALF KEY",
    description: "Half of the key needed to enter the master bedroom.",
    canPickUp: true,
  });
}

export function createMasterKey(): Item {
  return Item.key(
    "MASTER KEY",
    "Fully completed MASTER KEY to the master bedroom.",
    "idMaster",
    true,
    true,
  );
}

/**
 * Upstairs / gallery / master from latest C++ (R2 hides + journal lore).
 */
export function buildUpstairsWorld(): Map<string, Room> {
  const rooms = new Map<string, Room>();

  const doubleDoors = new Door(
    true,
    "idMaster",
    "You are now in the Master Bedroom. The room is elegantly decorated with fine linens and rich colors.",
    "DOUBLE DOORS",
  );

  const scribbledNote = Item.note(
    "SCRIBBLED NOTE",
    "A SCRIBBLED NOTE that looks like a child's drawing of two kids side by side, both looking almost exactly similair, but one of the children seems to have jagged teeth instead of normal teeth.",
    true,
  );

  const upstairsBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "A BOTTLE OF PILLS with a faded label.",
    50,
    true,
    true,
  );

  const combinationLock = Item.interactable(
    "COMBINATION LOCK",
    "A three word COMBINATION LOCK...",
    false,
    {
      kind: "puzzle",
      puzzleId: "mirror",
      inputMessage: "Do you want to solve the three word combination? (YES or NO)",
      outputMessage: "Test",
    },
  );

  const altar = Item.interactable(
    "ALTAR",
    "An ALTAR stands before you with a knife...",
    false,
    {
      kind: "puzzle",
      puzzleId: "gallery",
      inputMessage: "Do you want to initiate puzzle? (YES or NO)",
      outputMessage: "Test",
    },
  );

  const lordPainting = Item.interactable(
    "CRIMSON LORD PORTRAIT",
    "CRIMSON LORD PORTRAIT of a regal man in a crimson cloak, with blood dripping from his lips as a glass is raised to his lips.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You reach to your mouth and see a speck of blood on your finger.",
    },
  );

  const barkeepPainting = Item.interactable(
    "BARKEEP PORTRAIT",
    "BARKEEP PORTRAIT of a stocky man cleaning a glass behind the bar, wearing a fake smile.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You feel a sensation wash over you, dulling your senses briefly.",
    },
  );

  const servantPainting = Item.interactable(
    "SERVANT PORTRAIT",
    "SERVANT PORTRAIT of a slender man performing menial tasks with a dripping green herb held behind his back.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You feel a dripping sensation on your back.",
    },
  );

  const lordSonPainting = Item.interactable(
    "HEIR PORTRAIT",
    "HEIR PORTRAIT of a young teen with a crown to big for his head and awkardly posing with his spear.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You feel the weight of expectation.",
    },
  );

  const townDrunkPainting = Item.interactable(
    "TOWN DRUNK PORTRAIT",
    "TOWN DRUNK PORTRAIT of an overweight man with a full glass of ale in his hand slumpt against the wall.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You feel briefly unsteady.",
    },
  );

  const servantSonPainting = Item.interactable(
    "SERVANT'S SON PORTRAIT",
    "SERVANT'S SON PORTRAIT of a small child with fists clenched looking at a hanging man.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "Your fists clench involuntarily.",
    },
  );

  const mobPainting = Item.interactable(
    "MOB PORTRAIT",
    "MOB PORTRAIT of a group of people with pitchforks and torches approaching a building.",
    false,
    {
      kind: "message",
      inputMessage: "Would you like to touch the portrait?",
      outputMessage: "You hear distant shouting.",
    },
  );

  const storyBook = Item.interactable(
    "STORYBOOK",
    "A giant STORYBOOK made of tough leather and weathered pages indicating many stories have been told from this book. It is opened to a page with a poem on it.",
    false,
    {
      kind: "message",
      inputMessage: "You read the title of a poem, 'The Cycle of a Servant.'",
      outputMessage:
        " The lord with crimson cloak, His eyes once sharp, but now they choke. \n A wineglass shattered at his feet, his lips were poisoned - death so sweet. \n The servant went into the night, The deed done, taking flight, blocking the way a spear of the night. \n The lords son seeking justice, lunged forward claiming blood. \n The servant however did not fall, gutting the son, no longer standing tall. \n The servant reached the lowly village, To the bar seeking refuge, Bleeding from his gut. \n The town drunk drank into the night, While the barkeep kept the light. \n However a mob did approach, The servant hid, but could not hide, Seized by the people he despised. \n So the end approached for the lowly servant, Vengeance acquired, accepted his end. \n Before he met his end, His sons eyes he met, \n Looking at his fathers soon to be killer, The servant knew the look, for he had seen it before, \n The reason that he had killed his lord, The servant was killed purpose fulfilled, \n However the servant knew before he died, His son would now live his same life.",
    },
  );

  const journal3 = Item.note(
    "JOURNAL 3",
    "A scroll which reads JOURNAL 3: Crane has been so busy with his new work and wealth. I do wish I could spend more time with him like we used to, but he says 'Soon he will not have to work.' I sure hope he's right, I miss him. I wonder how Henry's doing?",
    true,
  );

  const journal4 = Item.note(
    "JOURNAL 4",
    "A liquid stained page which reads JOURNAL 4: Heard about Henry, apparently he lost his job and family. They left him after he got fired from his job over some drunken incident. I hope he is doing okay and if Crane has time, he should go visit him like the old days.",
    true,
  );

  const candle3 = Item.key(
    "CANDLE",
    "The third CANDLE is scribbled on the side... hm.",
    "C3",
    true,
    true,
  );

  const bedroomBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "A BOTTLE OF PILLS with a faded label.",
    50,
    true,
    true,
  );

  rooms.set(
    "UPSTAIRS",
    new Room({
      description:
        "You are now upstairs. The area is dimly lit and there are several doors leading to other parts of the mansion. There is a set of double doors at the end of the hallway with a complex lock. The lock has two halves of a dais empty that form an opening mechanism similair to a safe. There is also a three word combination lock on the wall between MIRROR ROOM 1 and MIRROR ROOM 2.",
      name: "UPSTAIRS",
      exits: [
        "PORTAL",
        "MIRROR ROOM 1",
        "MIRROR ROOM 2",
        "STORYTELLER'S ROOM",
        "GALLERY",
        "DOUBLE DOORS",
      ],
      doors: [doubleDoors],
      items: [scribbledNote, combinationLock, upstairsBottle],
    }),
  );

  rooms.set(
    "MIRROR ROOM 1",
    new Room({
      description:
        "You enter a grand parlor bathed in soft, golden sunlight streaming through tall, arched windows. The room is elegantly furnished with a velvet chaise lounge positioned in the center and its deep burgundy fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single white rose, perfectly fresh. The air smells faintly of lavender, adding a serene ambiance to the room. A plush rug embroidered with intricate floral patterns cover the floor, leading to a door on the opposite side of the room.",
      name: "MIRROR ROOM 1",
      exits: ["UPSTAIRS"],
    }),
  );

  rooms.set(
    "MIRROR ROOM 2 TABLE",
    new Room({
      description: "You are under the table. You are safe from any threats.",
      name: "MIRROR ROOM 2 TABLE",
      exits: ["MIRROR ROOM 2"],
      isSafe: true,
    }),
  );

  rooms.set(
    "MIRROR ROOM 2",
    new Room({
      description:
        "Stepping into this parlor feels eerily familiar. Bathed in soft golden moonlight streaming through tall, arched windows. The room is elegantly furnished with a velvet chaise lounge positioned in the center and its deep forest green fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single black rose, perfectly fresh. The air smells faintly of soot, adding a serene ambiance to the room. A plush rug embroidered with intricate floral patterns cover the floor, leading to a door on the opposite side of the room. There is another table that can used to be hide from the monster.",
      name: "MIRROR ROOM 2",
      exits: ["UPSTAIRS", "MIRROR ROOM 2 TABLE"],
    }),
  );

  rooms.set(
    "STORYTELLER'S BED",
    new Room({
      description: "You are under the bed. You are safe from any threats.",
      name: "STORYTELLER'S BED",
      exits: ["STORYTELLER'S ROOM"],
      isSafe: true,
    }),
  );

  rooms.set(
    "STORYTELLER'S ROOM",
    new Room({
      description:
        "You enter a room filled with a luxuorious carpet, fancy linen bedsheets, and elegant embroidery all around. In the center of the room there is a stand. On top of the stand is a big tome open to the page of a story. There is a bed that can be used to hide from the monster.",
      name: "STORYTELLER'S ROOM",
      exits: ["UPSTAIRS", "STORYTELLER'S BED"],
      items: [storyBook, journal3],
    }),
  );

  rooms.set(
    "GALLERY",
    new Room({
      description:
        "You enter a room with many portraits, all of them depicting different people of different statuses. All of the portraits seem to be calling you to touch them.",
      name: "GALLERY",
      exits: ["UPSTAIRS"],
      items: [
        altar,
        lordPainting,
        barkeepPainting,
        servantPainting,
        lordSonPainting,
        mobPainting,
        townDrunkPainting,
        servantSonPainting,
      ],
    }),
  );

  rooms.set(
    "MASTER BED",
    new Room({
      description: "You are under the bed. You are safe from any threats.",
      name: "MASTER BED",
      exits: ["MASTER BEDROOM"],
      isSafe: true,
    }),
  );

  rooms.set(
    "MASTER BEDROOM",
    new Room({
      description:
        "You are now in the Master Bedroom. The room is elegantly decorated with fine linens and rich colors. There is a bed that can be used to hide from the monster.",
      name: "MASTER BEDROOM",
      exits: ["UPSTAIRS", "GARDEN", "MASTER BED"],
      items: [candle3, bedroomBottle, journal4],
    }),
  );

  return rooms;
}
