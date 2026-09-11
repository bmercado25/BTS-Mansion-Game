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
    "Fully completed MASTER KEY to the master bedroom",
    "idMaster",
    true,
    true,
  );
}

/**
 * Upstairs / gallery / master content from C++ GameControllerClass.cpp (Phase 5b).
 * GARDEN exit from master connects to the outdoor wing (Phase 5c).
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
    "SCRIBBLED NOTE that looks like a child's drawing of two kids side by side, both looking almost exactly similair, but one of the children seems to have jagged teeth instead of normal teeth.",
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

  const storyBook = Item.interactable(
    "STORYBOOK",
    "A giant STORYBOOK made of tough leather and weathered pages, indicating many stories have been told from this book. It is open to a page with a poem on it.",
    false,
    {
      kind: "message",
      inputMessage: "You read the title of a poem, 'The Cycle of a Servant'.",
      outputMessage:
        " The lord with crimson cloak, His eyes once sharp, but now they choke. \n A wineglass shattered at his feet, his lips were poisoned - death so sweet. \n The servant went into the night, The deed done, taking flight, blocking the way a spear of the night. \n The lord's son seeking justice, lunged forward claiming blood. \n The servant however did not fall, gutting the son, no longer standing tall. \n The servant reached the lowly village, To the bar seeking refuge, Bleeding from his gut. \n The town drunk drank into the night, While the barkeep kept the light. \n However a mob did approach, The servant hid, but could not hide, Seized by the people he despised. \n So the end approached for the lowly servant, Vengeance acquired, accepted his end. \n Before he met his end, His son's eyes he met, \n Looking at his father's soon to be killer, The servant knew the look, for he had seen it before, \n The reason that he had killed his lord, The servant was killed purpose fulfilled, \n However the servant knew before he died, His son would now live his same life.",
    },
  );

  const candle3 = Item.key(
    "CANDLE",
    "THE third CANDLE is scribbled on the side... hm",
    "C3",
    true,
    true,
  );

  const bedroomBottle = Item.consumable(
    "BOTTLE OF PILLS",
    "a BOTTLE OF PILLS with a faded label",
    50,
    true,
    true,
  );

  rooms.set(
    "UPSTAIRS",
    new Room({
      description:
        "You are now upstairs. The area is dimly lit, and there are several doors leading to other parts of the mansion. There is a set of double doors at the end of the hallway with a complex lock. The lock has two halves of a dais empty, that form an opening mechanism similair to a safe. There is also a three word combination lock on the wall in between MIRROR ROOM 1 and MIRROR ROOM 2.",
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
      items: [scribbledNote, combinationLock],
    }),
  );

  rooms.set(
    "MIRROR ROOM 1",
    new Room({
      description:
        "You enter a grand parlor bathed in soft, golden sunlight streaming through tall, arched windows. The room is elegantly furnished, with a velvet chaise lounge positioned in the center, its deep burgundy fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single white rose, perfectly fresh. The air smells faintly of lavender, adding a serene ambiance to the room. A plush rug, embroidered with intricate floral patterns, covers the floor, leading to a door on the opposite side of the room.",
      name: "MIRROR ROOM 1",
      exits: ["UPSTAIRS"],
    }),
  );

  rooms.set(
    "MIRROR ROOM 2",
    new Room({
      description:
        "Stepping into this parlor feels eerily familiar. Bathed in soft golden moonlight streaming through tall, arched windows. The room is elegantly furnished, with a velvet chaise lounge positioned in the center, its deep forest green fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single black rose, perfectly fresh. The air smells faintly of soot, adding a serene ambiance to the room. A plush rug, embroidered with intricate floral patterns, covers the floor, leading to a door on the opposite side of the room.",
      name: "MIRROR ROOM 2",
      exits: ["UPSTAIRS"],
    }),
  );

  rooms.set(
    "STORYTELLER'S ROOM",
    new Room({
      description:
        "You enter a room filled with a luxuorious carpet, fancy linen bedsheets, and elegant embroidery all about. In the center of the room on a stand, is a big tome open to the page of a story.",
      name: "STORYTELLER'S ROOM",
      exits: ["UPSTAIRS"],
      items: [storyBook],
    }),
  );

  rooms.set(
    "GALLERY",
    new Room({
      description:
        "You enter a room with many portraits, all of them depicting different people of different statuses. All of the portraits are almost calling you to touch them.",
      name: "GALLERY",
      exits: ["UPSTAIRS"],
      items: [altar, lordPainting, barkeepPainting],
    }),
  );

  rooms.set(
    "MASTER BEDROOM",
    new Room({
      description:
        "You are now in the Master Bedroom. The room is elegantly decorated with fine linens and rich colors.",
      name: "MASTER BEDROOM",
      exits: ["UPSTAIRS", "GARDEN"],
      items: [candle3, bedroomBottle],
    }),
  );

  return rooms;
}
