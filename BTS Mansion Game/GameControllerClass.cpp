
#include "GameControllerClass.h"
#define NOMINMAX
#include "RoomClass.h"
#include "InteractClass.h"
#include "PickUpItemClass.h"
#include "MovementClass.h"
#include "PlayerClass.h"
#include "UserInterfaceClass.h"
#include "ItemClass.h"
#include "Door.h"
#include "Puzzle.h"
#include "GalleryPuzzle.h"
#include "MirrorPuzzle.h"
#include "MonsterClass.h"
#include "FountainPuzzle.h"
#include "MazePuzzle.h"
#include "MemoryPuzzle.h"
#include "ChantPuzzle.h"
#include <iostream>
#include <sstream>
#include <list>
#include <algorithm>
#include<string>
#include <unordered_map>
#include <chrono>
#include <thread>
#include <algorithm> 
#include <cctype>
#include <locale>
#include <windows.h>

GameControllerClass::GameControllerClass() {
    // Initialize backstory in the constructor
    backstory = "You step out of the car arriving at the campsite."
        "\nIt was a long drive about 40 miles removed from civilization."
        "\nThe fresh air hits your nose and you feel in tune with nature as your friend steps up next to you."
        "\nHe tells you how excited they are to be here and you recall how you've been friends for so long."
        "\nTaking the time do spontaneous trips like this is one of the reasons why."
        "\nAfter you set up for the night, your friend says he's going to take a leak."
        "\nYou sit by the fire, thinking of all the fun activities planned for this trip..."
        "\nSuddenly an arm coils around your neck and forces a damp rag onto your face."
        "\nYou claw and try to scream for your friend, unable to escape the grasp of whoever this is."
        "\nYour vision begins to swim and quickly fades to nothingness."
        "\nWaking up, head fuzzy, you look around to find yourself in an old luxurious building as big as a mansion."
        "\nWhat the fuck?"
        "\n----------------------"
        "\n INSTRUCTIONS: Any word that is in all caps, such as INSPECT, PICKUP or GARDEN, is a keyword and can be inputted for an action"
        "\n----------------------";

    // Initialize endings
    //Good ending
    goodEnding = "You instantly fall unconcious, and begin to see the origin story of this mansion..."
        "\nHenry and Crane were best friends since childhood, both living quiet lives as neighbors in the 1800s."
        "\nOne day Crane reconnected with  his distant family from England, who were very wealthy."
        "\nCrane and his wife were showered with gifts from these relatives."
        "\nCrane was also offered a position to work for these relatives, receiving a significant pay bump."
        "\nWith two children and all of these new riches, Cranes life was changing for the better. Or so he thought."
        "\nDuring this time, Henry and Crane began drifting apart, sparking jealousy and anger from Henry."
        "\nHenry would lose his job, his wife, and custody of the kids, becoming a resentful and angry man."
        "\nTurning to the bottle, Henry stewed. Why did Crane receive all the riches? Wait what is that? A newspapr headlined |Crane Mansion Finished|."
        "\nThis was the final straw, Henry went home, grabbed his rifle and rusty knife, then drunkenly stumbled towards this new mansion."
        "\nHenry kicked the doors open to the Foyer, shooting the startled butler in the gut twice. Then he turned toward the lounge."
        "\nCrane's wife yells in panic, begging Henry to explain himself. 'Too loud,' Henry thinks and shoots the woman in the head."
        "\nThe child she was taking care of was next, putting it down with one round. Crane rushed down to see what was going on and froze in terror."
        "\nSeeing his best friend become a monster, he takes out his small pistol, shooting Henry in the leg. Henry charges towards Crane." 
        "\nHis leg wound no longer bleeding red but now a black sludge."
        "\nAs the two began grappling, Henry felt a hint of remorse, but it was quickly consumed by cold emptiness."
        "\nHenry said, |Even if you kill me Crane, I swear that my bloodline will hunt yours for the rest of eternity!|"
        "\nCrane uses this distraction to push Henry to the wall, getting slashed across the chest with Henry's rusty knife in the process."
        "\nCrane gets his pistol underneath Henrys chin, pulling the trigger. Guts and black blood fly everywhere, coating Crane and the wall."
        "\nSlumping down next to the corpse of his once friend, Crane can not help but think of Henrys last dying words."
        "\nYou wake up and you see the mansion slowly melting away turning into black sludge, along with Crane and his family in spectral forms."
        "\nCrane nods to you in thanks, as your friend is laying next to you, injured but alive, and looks to you."
        "\n'What just happened?' he asks."
        "\n'It's a long story, you tried to kill me and then I exorcised some evil multi generational curse,' you say."
        "\n'That's pretty cool, I guess. After this, you down for fast food on the way back?"
        "\n'Yeah sure let's go!'"
        "\nYou and your friend venture back to the car and can now breathe easily, knowing that the curse is broken or at least you hope so.";

    //Neutral ending
    neutralEnding = "The room sudders, all of the candles light up at once and bright light filling the room with you."
        "\nThe monster bursts into the ritual room and lunges for you."
        "\nThe light from each candle shoot out one by one, wrapping around and restraining it like chains."
        "\nThe monster lets out a high pitched screech and its jet black flesh begins to sizzle and melt."
        "\nMelting away, the monster is revealed to be your friend. He islifeless and pale, lying on the floor with eyes staring at you in shame."
        "\nThe light blinds you and you suddenly find yourself outside of the manion, back in the woods."
        "\nBefore any more horrific events can pull you back in, you run as fast as you can."
        "\nYou do not know if it is toward civilization, but you know that it is far away from this Big Terrible Shitty Mansion.";

    //Bad ending
    badEnding = "The room goes silent. You stand there waiting for something,"
        "\nno candles appear, no keys are given to you. All you hear is the monster approaching."
        "\nNowhere to hide, your heart races, staking your life that whatever this ritual was did worked."
        "\nThe monster enters and seems to realize the ritual you performed, or at least, tried to perform."
        "\nIt looks at you and raises its elongated hand and fingers up, slowly beginning to count down."
        "\n5, a candle goes out."
        "\n4, another candle goes out."
        "\n3, the room grows darker."
        "\n2, only one candle remains."
        "\n1, darkness."
        "\nThe last thing you hear is your friend's voice saying |He made me| before you die.";
}
void GameControllerClass::startGame() {
    showMenu();
    //TODO: The below line has been commented out for testing purposes. Reinstate before merging.
    //displayBackstory();
    system("cls");
    gameLoop();
}


void GameControllerClass::pickUpNoteSequence(PlayerClass& myPlayer) {

    ItemClass note1("Welcome Note", "You have entered the mansion", true,"PaperPickup.wav"); // define note item
    InteractClass interactWithNote; // define interact class
    PickUpItemClass myPickUpClass(note1); // define pickup class
    UserInterfaceClass Myuserinterface;

    std::cout << "You are in room 1, there is a note on the ground next to you." << std::endl; //Room Message

    Myuserinterface.displayPrompt("enter PICKUP to pick up the item");
    Myuserinterface.userInput();


    interactWithNote.setInputMessage("You have picked up the note!"); //message when ITEM IS PICKED UP


    //Need to create the user interaction to add item to inventory
    if (Myuserinterface.getCurrentInput() == "PICKUP")
    {
        //myPickUpClass.addToInventory(myPlayer);  // Add the note to the player's inventory
        Myuserinterface.displayPrompt("You Have Picked Up an Item."); // Message upon successful interaction
    }
    else
    {
        // If the user didn't type "PICKUP",
        std::cout << "You did not pick up the note. Try 'PICKUP'." << std::endl;
    }

}

void GameControllerClass::viewInventory(PlayerClass& myPlayer) {

    UserInterfaceClass Myuserinterface; //Lines 62-65 are for testing purposes to make sure code works, prompting user won't be necessary
    //since prompting will be done after user has already asked to open inventory and then this function will be called

    std::cout << std::endl << std::endl;
    std::vector<ItemClass> myInventory = myPlayer.getInventory(); //Setting myInventory to direct reference of players inventory
    int inventorySize = myPlayer.getInventorySize();

    if (myPlayer.getInventorySize() == 0) {
        Myuserinterface.displayPrompt("You have nothing in your inventory");
        return; 
    }
    for (int i = 0; i < inventorySize; i++)
    {
        std::cout << myInventory[i].getName() << std::endl << std::endl; //Printing all of the users inventory
    }

    Myuserinterface.displayPrompt("Type the name of an item to get its description or type BACK to exit inventory");
    Myuserinterface.userInput(); //Allowing user to inspect from inventory getting input

    if (Myuserinterface.getCurrentInput() == "BACK")
    {
        system("cls");
        return;
    }

    bool itemFound = false;
    for (int i = 0; i < inventorySize; i++)
    {
        if (myInventory[i].getName() == Myuserinterface.getCurrentInput()) //Checking all the input and printing the description of entered item
        {

            system("cls");
            std::cout << myInventory[i].getName() << ": " << myInventory[i].getDescription() << std::endl;
            //below is temporary functionality for using an item to reduce sanity
            //TODO: have logic to prompt the player on whether they want to use an item in the inventory
            //because right now it just uses the item with no care for whether the player wants to or not
            //and also it's just the pills working right now and if we want more usable items this needs refactoring
            if (myInventory[i].getName() == "BOTTLE OF PILLS")
            {
                updateSanity(myPlayer, myInventory[i].getValue());
                myPlayer.useItem("BOTTLE OF PILLS");
                PlaySound(TEXT("PillBottle.wav"), NULL, SND_FILENAME | SND_ASYNC);

                std::cout << "You used the bottle of sanity pills. The world makes a bit more sense again." << std::endl;
            }
            //End sanity item functionality
            itemFound = true;
            break;
        }
    }
    if (!itemFound)
    {
        system("cls");
        std::cout << "The item you entered is not in your inventory." << std::endl;
    }
}




void GameControllerClass::displayBackstory() {
    std::istringstream stream(GameControllerClass::backstory);
    std::string line;

    while (std::getline(stream, line)) { //algorithm to display story line by line, user will press enter via waitForInput() function form UI class
        UI.displayPrompt(line);
        UI.waitForInput();
    }
}

void GameControllerClass::gameLoop() {
    //Ending sequence call for testing
    UserInterfaceClass ui;
    
    /*we initialize the rooms and player class in the beginning. In the future we will probably wrap this in a function or refactor this class to remove clutter from gameLoop*/

    std::unordered_map<std::string, RoomClass> rooms; //hashmap for all rooms
    std::unordered_map<std::string, Door> doors; // hashmap for all doors

    //Declare all doors TODO: Joey add logic for door map 

    doors["DOOR"] = Door(true, "BBBB", "You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move.A dim eeries light illuminates the room, as you stand here in feeling the chill of the cold and heavy air surronding you.There also appears to be a ornate wooden DOOR that is locked", "DOOR"); // create FOYER door
    doors["BOOKSHELF"] = Door(true, "BookKey", "You enter the library, filled to the brim with bookshelves.", "BOOKSHELF");
    doors["DOUBLE DOORS"] = Door(true, "idMaster", "You are now in the Master Bedroom. The room is elegantly decorated with fine linens and rich colors.", "DOUBLE DOORS"); //Adding master bedroom door
    doors["BLOCKED HEDGE MAZE"] = Door(true, "MAZEKEY", "You pour the holy water on the dark force blocking the entrance to the hedge maze, granting yourself access as the dark sludge burns away.","BLOCKED HEDGE MAZE");
    doors["MAZE EXIT"] = Door(true, "MAZEEXITKEY", "Using the map, you are able to find your way out of the maze, reaching the exit.", "MAZE EXIT");
    doors["STUDY DOOR"] = Door(true, "STUDYKEY", "You unlock the door with the study key, unlocking the study.", "STUDY DOOR");

    //Greater Library Door
    doors["GREATER LIBRARY DOOR"] = Door(true, "DHKey", "You have now opened the door, you are now in the GREATER LIBRARY", "GREATER LIBRARY DOOR");



    std::vector<Door> FoyerDoors = { doors["DOOR"] };
    std::vector <Door> Library_Doors = { doors["BOOKSHELF"], doors["DOOR"], doors["GREATER LIBRARY DOOR"]};
    std::vector<Door> greaterLibraryDoors = { doors["STUDY DOOR"] };
    std::vector <Door> Master_Doors = { doors["DOUBLE DOORS"] };
    std::vector<Door> shedDoors;       // Doors for the Shed
    std::vector<Door> mazeDoors = { doors["BLOCKED HEDGE MAZE"] };       // Doors for the Hedge Maze
    std::vector<Door> fountainDoors;   // Doors for the Fountain
    std::vector<Door> mazeExitDoors = { doors["MAZE EXIT"] }; //Exit of hedge maze

    //greater library puzzle
    GreaterLibraryPuzzle greaterLibraryPuzzle("DODGE", "Some of the books in this room stand out to you. Perhaps they contain some sort of code?");

    //define all ineractions
    InteractClass* userInteractStatueA = new InteractClass("Would you like to INTERACT with the statue?", "You feel a wave of knowledge wash over you, like you've learned something from someone previously here before you."); //Defining statue interaction
    InteractClass* userInteractKitchenCounter = new InteractClass("Would you like to look at the kitchen counter?", "The kitchen counter has a striped design with four different coloed. The first color is red, then its blue, green, and purple.");
    InteractClass* userInteractSafe = new InteractClass("Would you like to look at the safe?", "Please enter a 4-digit code.");
    InteractClass* userInterectSafeDiningHall = new InteractClass("Would you like to look at the safe?", "Please enter the correct 4-digit code.");
    InteractClass* userInteractBody1 = new InteractClass("Would you like to look at dead body 1?", "You touched the shirt and it revealed the number 8.");
    InteractClass* userInteractBody2 = new InteractClass("Would you like to look at dead body 2", "You touched the shirt and it revealed the number 6.");
    InteractClass* userInteractBody3 = new InteractClass("Would you like to look at dead body 3", "You touched the shirt and it revealed the number 9.");
    InteractClass* userInteractBody4 = new InteractClass("Would you like to look at dead body 4", "You touched the shirt and it revealed the number 1.");
    //added interact for tombstones 
    InteractClass* userInteractTombstone1 = new InteractClass("Would you like to look at tombstone 1?", "This tombstone reads the name 'Layla Smith.'");
    InteractClass* userInteractTombstone2 = new InteractClass("Would you like to look at tombstone 2?", "This tombstone does not have anything written, just scratch marks.'");
    InteractClass* userInteractTombstone3 = new InteractClass("Would you like to look at tombstone 3?", "This tombstone has a name that is not readable.");
    InteractClass* userInteractTombstone4 = new InteractClass("Would you like to look at tombstone 4?", "This tombstone reads the name 'Joseph Smith.'");
    InteractClass* storyBookInteraction = new InteractClass("You read the title of a poem, 'The Cycle of a Servant.'", " The lord with crimson cloak, His eyes once sharp, but now they choke. \n A wineglass shattered at his feet, his lips were poisoned - death so sweet. \n The servant went into the night, The deed done, taking flight, blocking the way a spear of the night. \n The lords son seeking justice, lunged forward claiming blood. \n The servant however did not fall, gutting the son, no longer standing tall. \n The servant reached the lowly village, To the bar seeking refuge, Bleeding from his gut. \n The town drunk drank into the night, While the barkeep kept the light. \n However a mob did approach, The servant hid, but could not hide, Seized by the people he despised. \n So the end approached for the lowly servant, Vengeance acquired, accepted his end. \n Before he met his end, His sons eyes he met, \n Looking at his fathers soon to be killer, The servant knew the look, for he had seen it before, \n The reason that he had killed his lord, The servant was killed purpose fulfilled, \n However the servant knew before he died, His son would now live his same life.");
    InteractClass* lordPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "You reach to your mouth and see a speck of blood on your finger.");
    InteractClass* barkeepPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "You feel a sensation wash over you, dulling your senses briefly.");
    InteractClass* servantPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "You begin to feel a sense of subservience that quickly turns into hatred.");
    InteractClass* lordSonPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "A blanket of pressure to perform falls over you, suffocating you with expectations unmet.");
    InteractClass* townDrunkPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "Your mind becomesm muddy and you stumble, catching yourself quickly.");
    InteractClass* servantSonPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "A burning vengeance fills your chest as you feel great loss.");
    InteractClass* mobPaintingInteraction = new InteractClass("Would you like to touch the portrait?", "A whirl of strong emotion pushes you forward, in a fervorous burst.");
    InteractClass* greaterLibraryPuzzleStarter = new InteractClass("Would you like to INTERACT with the lock?", "", greaterLibraryPuzzle);
    InteractClass* gBookInteraction1 = new InteractClass("Would you like to read the book?", "This book tells the story of a king who began a Dangerous journey across all of the lands.");
    InteractClass* gBookInteraction2 = new InteractClass("Would you like to read the book?", "This book describes a king struggling to survive during the beginning of his jOurney.");
    InteractClass* gBookInteraction3 = new InteractClass("Would you like to read the book?", "This book tells the tale of a king reaching his first town, and seeing the poverty of the people in his domain firsthanD");
    InteractClass* gBookInteraction4 = new InteractClass("Would you like to read the book?", "This book describes a king having to beg alongside beGgars, selling his crown for food.");
    InteractClass* gBookInteraction5 = new InteractClass("Would you like to read the book?", "This book shows an image of a corpse lying dEad in the wilderness, royal cape tattered.");


    //define all items
    ItemClass statueA("STATUE", "A STATUE of a woman carrying a book.", false, userInteractStatueA); // Define the statue as an item
    ItemClass keyB("RUSTY KEY", "A RUSTY KEY, it looks very fragile and brittle.", "BBBB", true, true, "KeySoundNew.wav"); //Initialzing items TEMP key B
    ItemClass loungeBottle("BOTTLE OF PILLS", "A BOTTLE OF PILLS with a faded label.", 50, true, true);
    ItemClass noteA("NOTE A", "A NOTE with dust and cobwebs all over. It reads: Welcome to the Mansion.", true, std::string("PaperPickup.wav")); //Defining TEMP note A
    ItemClass metalSafe("METAL SAFE", "A safe that appears to accept a 4 digit code.", false, userInterectSafeDiningHall);
    ItemClass deadBody1("DEAD BODY 1", "A dead body with a red shirt and has his mouth open.", false, userInteractBody1);
    ItemClass deadBody2("DEAD BODY 2", "A dead body with a blue shirt and has his skull cracked open.", false, userInteractBody2);
    ItemClass deadBody3("DEAD BODY 3", "A dead body with a green shirt and has his hands on the floor.", false, userInteractBody3);
    ItemClass deadBody4("DEAD BODY 4", "A dead body with a purple shirt and has his right leg over his left leg.", false, userInteractBody4);
    ItemClass tombstone1("TOMBSTONE 1", "", false, userInteractTombstone1);
    ItemClass tombstone2("TOMBSTONE 2", "", false, userInteractTombstone2);
    ItemClass tombstone3("TOMBSTONE 3", "", false, userInteractTombstone3);
    ItemClass tombstone4("TOMBSTONE 4", "", false, userInteractTombstone4);
    ItemClass galleryKey = ItemClass("GALLERY HALF KEY", "Half of the key needed to enter the master bedroom.", true, true, "KeySoundNew.wav");
  
    ItemClass greaterLibraryKey = ItemClass("GREATER LIBRARY KEY", "A Shiny GREATER LIBRARY KEY with grapes on the handle,it appears to open the greater library","DHKey",true, true,"KeySoundNew.wav");    //Initializing key from safe in dining hall
    ItemClass mirrorKey = ItemClass("MIRROR HALF KEY", "Half of the key needed to enter the master bedroom.",true, true, "KeySoundNew.wav");
    ItemClass kitchenCounter("KITCHEN COUNTER", "a kithchen counter with multiple colors", false, userInteractKitchenCounter);
    ItemClass kitchenBottle("BOTTLE OF PILLS", "a BOTTLE OF PILLS with a faded label", 50, true, true);
    // added items such as note and journal for the made classes 
    ItemClass guestroomJournal("GUESTROOM JOURNAL", "A leather-bound journal filled with notes from a guest. Some entries are scribbled hastily, mentioning strange noises and shadows in the night.", true,true);
    ItemClass bathroomNote("BATHROOM NOTE", "A faded BATHROOM NOTE, scribbled with hurried handwriting. It reads:'The mirror is the key to the next step. Look closely.'", true, std::string("PaperPickup.wav"));
    ItemClass ballroomNote("BALLROOM NOTE", "A handwritten note left behind, detailing strange occurrences during the last grand ball.", true, std::string("PaperPickup.wav"));
    //Library Items
    ItemClass Book("OLD BOOK", "An OLD BOOK, it appears to belong to a bookshelf.", "BookKey", true, true, "General Pickup.wav");

    //Items for Story
    //Journals:
    ItemClass journal1("JOURNAL 1", "A dusty page which reads JOURNAL 1: Henry and Crane went out last night. Crane had a stupendous time and I am glad that he has such a reliable friend.", true, true);
    ItemClass journal2("JOURNAL 2", "A torn page which reads JOURNAL 2: Apparently my beloved husband Crane is related to some wealthy English family and they are coming to America! They already sent some gifts that are extravagant and they are offering Crane a very wealthy position in their family. This is amazing!", true, true);
    ItemClass journal3("JOURNAL 3", "A scroll which reads JOURNAL 3: Crane has been so busy with his new work and wealth. I do wish I could spend more time with him like we used to, but he says 'Soon he will not have to work.' I sure hope he’s right, I miss him. I wonder how Henry's doing?", true, true);
    ItemClass journal4("JOURNAL 4", "A liquid stained page which reads JOURNAL 4: Heard about Henry, apparently he lost his job and family. They left him after he got fired from his job over some drunken incident. I hope he is doing okay and if Crane has time, he should go visit him like the old days.", true, true);
    ItemClass journal5("JOURNAL 5", "A crumpled page which reads JOURNAL 5: Layla is dead. Henry killed her and my poor son Joseph. I found her journal and felt I shouldnt leave it without an ending. What did I do to deserve this? Henry's son, Lester sent me a letter that he would come visit in light of recent events from the past month. I hope to learn what happened to Henry and get some closure.", true, true);
    ItemClass newspaperClipping("NEWSPAPER CLIPPING", "A NEWSPAPER CLIPPING with headline Mansion Murder! Crane Smith murdered in his new Mansion two months after his family were murdered. Rumors are the son of first murderer, HENRY JENKINS, whose named LESTER JENKINS, was the killer. However, nothing has been confirmed as of late.", true, true);

    //Greater Library Items
    ItemClass greaterLibraryBottle("BOTTLE OF PILLS", "A BOTTLE OF PILLS with a faded label.", 50, true, true);
    ItemClass gBook1("PRISTINE BOOK", "A PRISTINE BOOK with a picture of a king on his throne.", false, gBookInteraction1);
    ItemClass gBook2("GRASSY BOOK", "A GRASSY BOOK with a picture of a king in the woods.", false, gBookInteraction2);
    ItemClass gBook3("WOODEN BOOK", "A WOODEN BOOK with a picture of a king entering a town.", false, gBookInteraction3);
    ItemClass gBook4("DIRTY BOOK", "A DIRTY BOOK with a picture of a king sitting in the dirt.", false, gBookInteraction4);
    ItemClass gBook5("TATTERED BOOK", "A TATTERED BOOK with a picture of a corpse.", false, gBookInteraction5);
    ItemClass studyKey = ItemClass("STUDY KEY", "An ornate key with lines of text scribbled on it.", "STUDYKEY", true, true); //Adding study key
    ItemClass combLock = ItemClass("WORD LOCK", "A WORD LOCK which takes a 5 letter word.", false, greaterLibraryPuzzleStarter);

    //Gallery Items
    ItemClass lordPainting = ItemClass("CRIMSON LORD PORTRAIT", "CRIMSON LORD PORTRAIT of a regal man in a crimson cloak, with blood dripping from his lips as a glass is raised to his lips.", false, lordPaintingInteraction);
    ItemClass barkeepPainting = ItemClass("BARKEEP PORTRAIT", "BARKEEP PORTRAIT of a stocky man cleaning a glass behind the bar, wearing a fake smile.", false, barkeepPaintingInteraction);
    ItemClass servantPainting = ItemClass("SERVANT PORTRAIT", "SERVANT PORTRAIT of a slender man performing menial tasks with a dripping green herb held behind his back.", false, servantPaintingInteraction);
    ItemClass lordSonPainting = ItemClass("HEIR PORTRAIT", "HEIR PORTRAIT of a young teen with a crown to big for his head and awkardly posing with his spear.", false, lordSonPaintingInteraction);
    ItemClass townDrunkPainting = ItemClass("TOWN DRUNK PORTRAIT", "TOWN DRUNK PORTRAIT of an overweight man with a full glass of ale in his hand slumpt against the wall.", false, townDrunkPaintingInteraction);
    ItemClass servantSonPainting = ItemClass("SERVANT'S SON PORTRAIT", "SERVANT'S SON PORTRAIT of a small child with fists clenched looking at a hanging man.", false, servantSonPaintingInteraction);
    ItemClass mobPainting = ItemClass("MOB PORTRAIT", "MOB PORTRAIT of a group of people with pitchforks and torches approaching a building.", false, mobPaintingInteraction);

    //Upstairs items
    ItemClass noteUpA = ItemClass("SCRIBBLED NOTE", "A SCRIBBLED NOTE that looks like a child's drawing of two kids side by side, both looking almost exactly similair, but one of the children seems to have jagged teeth instead of normal teeth.", true, std::string("PaperPickup.wav")); //Note for clue to mirror puzzle
    ItemClass storyBook = ItemClass("STORYBOOK", "A giant STORYBOOK made of tough leather and weathered pages indicating many stories have been told from this book. It is opened to a page with a poem on it.", false, storyBookInteraction);
    ItemClass masterKey = ItemClass("MASTER KEY", "Fully completed MASTER KEY to the master bedroom.", "idMaster", true, true); //Adding master bedroom key
    ItemClass bedroomBottle = ItemClass("BOTTLE OF PILLS", "A BOTTLE OF PILLS with a faded label.", 50, true, true);
    ItemClass upstairsBottle = ItemClass("BOTTLE OF PILLS", "A BOTTLE OF PILLS with a faded label.", 50, true, true);
    //Shed items
    ItemClass shedBottle = ItemClass("BOTTLE OF PILLS", "A BOTTLE OF PILLS with a faded label.", 50, true, true);
    
    //Fountain items
    ItemClass mazeKey = ItemClass("HOLY WATER", "A pristine bottle of blessed water.", "MAZEKEY", true, true); //Key to unlock hedge maze

    //Hedge maze items
    ItemClass mazeExitKey = ItemClass("MAZE MAP", "A map outlining the layout of the maze that can lead you to the exit.", "MAZEEXITKEY", true, true); //Key to unlock hedge maze exit

    //define candles
    ItemClass Candle1("CANDLE", "A CANDLE with pentagram etchings.", "C1", true, true); //candle item instance, name must remain candle to be consumed in main algorithm
    ItemClass studyCandle("CANDLE", "A CANDLE with a pentagram design.", "C2", true, true);
    ItemClass candle3 = ItemClass("CANDLE", "The third CANDLE is scribbled on the side... hm.", "C3", true, true); //Third candle item
    ItemClass candle4 = ItemClass("CANDLE", "The fourth CANDLE, one more until you're finally out of this nightmare.", "C4", true, true); //Fourth candle

    //define all itemclass vectors for rooms
    std::vector <ItemClass> roomA_Items = { noteA, statueA }; //Creating items
    std::vector <ItemClass> roomB_Items = { keyB, loungeBottle };
    std::vector <ItemClass> library_Items = {Book};
    std::vector<ItemClass>diningHallItems = { metalSafe, deadBody1,deadBody2,deadBody3,deadBody4 };
    std::vector<ItemClass> greaterLibraryItems = { greaterLibraryBottle, combLock, gBook4, gBook1, gBook2, gBook5, gBook3 };
    std::vector <ItemClass>graveyardItems = { tombstone1, tombstone2,tombstone3,tombstone4 };
    std::vector <ItemClass> hiddensection_Items = { Candle1, journal2 };
    std::vector <ItemClass> storytellerItems = { storyBook, journal3 }; //Storyteller's items
    std::vector <ItemClass> masterBedroomItems = { candle3, bedroomBottle, journal4 }; //Master bedroom items
    std::vector<ItemClass> ballroomItems = { ballroomNote }; //ballroom items
    std::vector<ItemClass> guestroomItems = {journal1 };//guestroom items
    std::vector<ItemClass> bathroomItems = { bathroomNote };//bathroom items
    //InteractClass* userInteractCandle = new InteractClass("Would you like to look at the candle?", "Pickup the candle");
    std::vector<ItemClass>studyItem = { studyCandle };
    std::vector<ItemClass>kitchenItems = { kitchenCounter, kitchenBottle };
    std::vector <ItemClass> portraits = { lordPainting, barkeepPainting, servantPainting, lordSonPainting, mobPainting, townDrunkPainting, servantSonPainting };

    //define puzzle solution/s
    std::vector <std::string> mirrorSolution = { "MOONLIGHT", "FOREST GREEN", "BLACK" };
    //defining Gallery puzzle
    GalleryPuzzle galleryPuzzle = GalleryPuzzle(portraits, { lordPainting, lordSonPainting, servantPainting }, "If you are stuck, there is perhaps something left behind by a long dead storyteller could help you here....");
    //defining mirror puzzle
    MirrorPuzzle mirrorPuzzle = MirrorPuzzle(mirrorSolution, "You notice that the combination lock has a small mirror engraved at the bottom....");
    //defining fountain puzzle
    FountainPuzzle fountainPuzzle = FountainPuzzle("FEAR", "MEMORY", "CLOCK", "GRAVE", 
        {"You find a pictograph on the side of the fountain,it has worn away by time. You can't quite tell what it depicts. A chill runs up your spine.",
        "You find a pictograph on the side of the fountain, it has worn away by time. You can't quite tell what it depicts. You swear you've seen it somewhere before.",
        "You find a pictograph on the side of the fountain, it has worn away by time. You can't quite tell what it depicts. It feels like you've been here for hours.",
        "You find a pictograph on the side of the fountain, it has worn away by time. You can't quite tell what it depicts. You get the sense that your end inexorably approaches."});
    //defining maze puzzle
    MazePuzzle mazePuzzle = MazePuzzle({ "RABBIT", "CROW", "SNAKE", "SCARAB" }, {"BADGER", "GOAT", "CARDINAL", "OWL", "BEAR", "CAT", "COYOTE"});

    InteractClass* mirrorPuzzleStarterInteraction = new InteractClass("Do you want to solve the three word combination? (YES or NO)", "Test", mirrorPuzzle);
    InteractClass* altarInteraction = new InteractClass("Do you want to initiate puzzle? (YES or NO)", "Test", galleryPuzzle);
    InteractClass* fountainPuzzleStarterInteraction = new InteractClass("Do you want to begin the Fountain Puzzle? (YES or NO)", "Test", fountainPuzzle);
    InteractClass* mazePuzzleStarterInteraction = new InteractClass("You should explore the maze, paying attention to your surrondings, do you want to explore? (YES or NO)", "Test", mazePuzzle);
    ItemClass mirrorPuzzleStarter = ItemClass("COMBINATION LOCK", "A three word COMBINATION LOCK...", false, mirrorPuzzleStarterInteraction);
    ItemClass galleryPuzzleStarter = ItemClass("ALTAR", "An ALTAR stands before you with a knife...", false, altarInteraction);
    ItemClass fountainPuzzleStarter = ItemClass("FOUNTAIN PANEL", "A FOUNTAIN PANEL is at the base of the fountain, it seems like you could push it as if it were a button...", false, fountainPuzzleStarterInteraction);
    ItemClass mazePuzzleStarter = ItemClass("LANTERN", "A LANTERN to help you see while you are exploring the maze...", false, mazePuzzleStarterInteraction);
    std::vector <ItemClass> upstairsItems = { noteUpA, mirrorPuzzleStarter, upstairsBottle }; //Upstairs items
    std::vector <ItemClass> galleryItems = { galleryPuzzleStarter, lordPainting, barkeepPainting, servantPainting, lordSonPainting, mobPainting, townDrunkPainting, servantSonPainting }; //Gallery items
    std::vector <ItemClass> shedItems = { shedBottle, journal5 }; //Shed items
    std::vector <ItemClass> fountainItems = { fountainPuzzleStarter }; //Fountain items
    std::vector <ItemClass> mazeExitItems = { candle4, newspaperClipping }; //Maze exit items
    std::vector <ItemClass> hedgeMazeItems = { mazePuzzleStarter }; //Hedge Maze Items



    //Defining downstairs rooms
    rooms["FOYER"] = RoomClass("You enter the foyer, the walls are lined with faded wallpaper and adorned with massive grim portraits of long forgotten residents whose eyes seem to follow your every move. A dim eeries light illuminates the room as you stand there feeling the chill of the cold and heavy air surronding you. On the floor there is a bloody butler's suit. There also appears to be a ornate wooden DOOR that is locked.\n", "FOYER", std::list<std::string>{"LOUNGE", "DOOR","KITCHEN DOOR", "GUESTROOM"}, FoyerDoors, roomA_Items);
    rooms["LIBRARY TABLE"] = RoomClass("You are under the table. You are safe from any threats.", "LIBRARY TABLE", std::list<std::string>{"LIBRARY"}, false, true);
    
    rooms["LIBRARY"] = RoomClass("You enter the library, filled to the brim with bookshelves.\n", "LIBRARY", std::list<std::string>{"FOYER", "BOOKSHELF", "GREATER LIBRARY DOOR", "LIBRARY TABLE"}, Library_Doors, library_Items);
    
    rooms["LOUNGE CLOSET"] = RoomClass("You are in the lounge closet. You are safe from any threats.", "LOUNGE CLOSET", std::list<std::string>{"LOUNGE"}, false, true);

    rooms["LOUNGE"] = RoomClass("You enter the lounge and there is a staircase, however there is a black sludge blocking the way. There are two blood stains that seem to be from two murder victims that stain the carpet.\n", "LOUNGE", std::list<std::string>{"FOYER", "DINING HALL DOOR","BATHROOM", "LOUNGE CLOSET"}, roomB_Items);
    rooms["GREATER LIBRARY"] = RoomClass("You are now in the greater library. There many books and shelves around and there seems to be a door leading to another room to an office.", "GREATER LIBRARY", std::list<std::string>{"LIBRARY","BALLROOM","STUDY DOOR"},greaterLibraryDoors, greaterLibraryItems);


   //created rooms for ballroom , guestroom, and bathroom
    rooms["BALLROOM"] = RoomClass("The grand ballroom is magnificent, with a chandelier hanging overhead and rows of windows draped in heavy, velvet curtains. The polished marble floors reflect the moonlight streaming through the windows, but there’s an eerie silence, as if the ghosts of past parties linger in the shadows.", "BALLROOM", std::list<std::string>{"GREATER LIBRARY"},ballroomItems);
    rooms["GUESTROOM"] = RoomClass("The guestroom is modest yet elegant, with a large bed covered in fine linens and a single window overlooking the mansion grounds. A wardrobe stands in one corner and a small desk is positioned near the bed. The air feels slightly colder here as if the room hasn’t been used in a while.","GUESTROOM",std::list<std::string>{"FOYER"},guestroomItems );
    rooms["BATHROOM"] = RoomClass( "The bathroom is dimly lit, with a large, ornate mirror above a marble sink. A clawfoot tub stands in the corner, its porcelain surface chipped, while faded towels hang on a rack nearby. The air is thick with the smell of dampness and the floor creaks underfoot as if the room is in disrepair.","BATHROOM",std::list<std::string>{"LOUNGE"},bathroomItems );


    rooms["STUDY DESK"] = RoomClass("You are under the study desk. You are safe from any threats.", "STUDY DESK", std::list<std::string>{"STUDY"}, false, true);
    rooms["STUDY"] = RoomClass("You enter the study, the walls are dark brown with shelfs full of books and paper scrolls. There is a desk that is rather neat and organize. Behind the desk is grand portrait of a man with a stern face, eyes so dark its makes you uncomfortable. The man's finger is pointing to what seems to be a cabinet and behind a pile of books you see a candle.", "STUDY", std::list<std::string>{"GREATER LIBRARY", "STUDY DESK"}, studyItem);
    //defenition for ritual room class, specific constructor
    rooms["RITUAL ROOM"] = RoomClass("You enter a room that does not invite you back. A perfect, pentacle drawn on the floor invites you to place a candle at each of it's vertecies. [Hint: enter CANDLE as input if you posses a candle].", "RITUAL ROOM", std::list<std::string>{"HIDDEN SECTION",}, true);
    //HIDDEN SECTION 
    rooms["HIDDEN SECTION"] = RoomClass("You now enter the hidden section, nothing is safe here and you feel a presence linger as if it was plucking your heartstrings. There is a table with a candle on top.", "HIDDEN SECTION", std::list<std::string>{"LIBRARY", "RITUAL ROOM"}, hiddensection_Items);
    
    //PORTAL
    RoomClass PORTAL = RoomClass("You step into the portal and feel a strange pull as reality warps around you. Moments later you find yourself in a different part of the mansion.",
        "PORTAL", std::list<std::string>{}, FoyerDoors, std::vector<ItemClass>{});
   
    //Defining upstairs rooms
    rooms["UPSTAIRS"] = RoomClass("You are now upstairs. The area is dimly lit and there are several doors leading to other parts of the mansion. There is a set of double doors at the end of the hallway with a complex lock. The lock has two halves of a dais empty that form an opening mechanism similair to a safe. There is also a three word combination lock on the wall between MIRROR ROOM 1 and MIRROR ROOM 2.",
        "UPSTAIRS", std::list<std::string>{"PORTAL", "MIRROR ROOM 1", "MIRROR ROOM 2", "STORYTELLER'S ROOM", "GALLERY", "DOUBLE DOORS"}, Master_Doors, upstairsItems);  // Add PORTAL as an option
    //Defining upstairs rooms
    rooms["MIRROR ROOM 1"] = RoomClass("You enter a grand parlor bathed in soft, golden sunlight streaming through tall, arched windows. The room is elegantly furnished with a velvet chaise lounge positioned in the center and its deep burgundy fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single white rose, perfectly fresh. The air smells faintly of lavender, adding a serene ambiance to the room. A plush rug embroidered with intricate floral patterns cover the floor, leading to a door on the opposite side of the room.", "MIRROR ROOM 1", std::list<string>{"UPSTAIRS"} );
    
    //Hiding table for Mirror Room 2
    rooms["MIRROR ROOM 2 TABLE"] = RoomClass("You are under the table. You are safe from any threats.", "MIRROR ROOM 2 TABLE", std::list<std::string>{"MIRROR ROOM 2"}, false, true);

    rooms["MIRROR ROOM 2"] = RoomClass("Stepping into this parlor feels eerily familiar. Bathed in soft golden moonlight streaming through tall, arched windows. The room is elegantly furnished with a velvet chaise lounge positioned in the center and its deep forest green fabric complementing the warm tones of the oak-paneled walls. A large, ornate mirror hangs above a marble fireplace on the north wall. On a small table beside the chaise, a crystal vase holds a single black rose, perfectly fresh. The air smells faintly of soot, adding a serene ambiance to the room. A plush rug embroidered with intricate floral patterns cover the floor, leading to a door on the opposite side of the room. There is another table that can used to be hide from the monster.", "MIRROR ROOM 2", std::list<string>{"UPSTAIRS","MIRROR ROOM 2 TABLE"});
    
    //Hiding bed for StoryTeller's Room
    rooms["STORYTELLER'S BED"] = RoomClass("You are under the bed. You are safe from any threats.", "STORYTELLER'S BED", std::list<std::string>{"STORYTELLER'S ROOM"}, false, true);

    rooms["STORYTELLER'S ROOM"] = RoomClass("You enter a room filled with a luxuorious carpet, fancy linen bedsheets, and elegant embroidery all around. In the center of the room there is a stand. On top of the stand is a big tome open to the page of a story. There is a bed that can be used to hide from the monster.", "STORYTELLER'S ROOM", std::list <string> {"UPSTAIRS","STORYTELLER'S BED"}, storytellerItems); //have a non pick upable item with poem in it
    rooms["GALLERY"] = RoomClass("You enter a room with many portraits, all of them depicting different people of different statuses. All of the portraits seem to be calling you to touch them.", "GALLERY", std::list <string> {"UPSTAIRS",}, galleryItems); //Room full of portraits for poem puzzle
   
    //Hiding bed for Master Bedroom
    rooms["MASTER BED"] = RoomClass("You are under the bed. You are safe from any threats.", "MASTER BED", std::list<std::string>{"MASTER BEDROOM"}, false, true);

    rooms["MASTER BEDROOM"] = RoomClass(
        "You are now in the Master Bedroom. The room is elegantly decorated with fine linens and rich colors. There is a bed that can be used to hide from the monster.",
        "MASTER BEDROOM",
        std::list<std::string>{"UPSTAIRS", "GARDEN","MASTER BED"}, // Add GARDEN as an option
        masterBedroomItems
    );    

    //Hiding table for dining hall
    rooms["DINING TABLE"] = RoomClass("You are under the dining table. You are safe from any threats.", "DINING TABLE", std::list<std::string>{"DINING HALL"}, false, true);

    rooms["DINING HALL"] = RoomClass("You are now in the Dining Hall. There are chairs and a large table which can be used for hiding from the monster. From here you can go to the kitchen.\n", "DINING HALL", std::list<std::string>{"DINING HALL DOOR", "KITCHEN","DINING TABLE"}, diningHallItems);
    

    //Hiding closet/Pantry for Kitchen
    rooms["PANTRY"] = RoomClass("You are in the pantry. You are safe from any threats.", "PANTRY", std::list<std::string>{"KITCHEN"}, false, true);

    rooms["KITCHEN"] = RoomClass("You are now in the Kitchen. There is a pantry closet that can be used to hide from the monster. You can return to the dining hall from here.\n", "KITCHEN", std::list<std::string>{"DINING HALL", "KITCHEN DOOR","PANTRY"}, kitchenItems);
    rooms["GARDEN"] = RoomClass(
        "You step outside into a serene garden, filled with vibrant flowers and lush greenery. The moon shines brightly above and you can hear the gentle rustling of leaves in the breeze. There's a feeling of tranquility here, but also an underlying sense of mystery, as if the garden holds secrets waiting to be uncovered.",
        "GARDEN",
        std::list<std::string>{"SHED", "FOUNTAIN", "BLOCKED HEDGE MAZE","GRAVEYARD"},
        mazeDoors,
        std::vector<ItemClass>{}// No items initially in the garden
    );
    // created graveyard room 
    rooms["GRAVEYARD"] = RoomClass(
        "You enter a shadowy graveyard with headstones scattered across the mist-covered ground. The air is thick with an eerie silence, broken only by the distant hoot of an owl. A chill runs down your spine as you realize this place holds secrets long forgotten.",
        "GRAVEYARD",
        std::list<std::string>{"GARDEN"},
        graveyardItems // Items found in the graveyard
    );


    //Hiding closet for Shed 
    rooms["SHED CLOSET"] = RoomClass("You are in the shed closet. You are safe from any threats.", "SHED CLOSET", std::list<std::string>{"SHED"}, false, true);

    // Shed Room
    rooms["SHED"] = RoomClass(
        "You enter a small, dusty shed filled with various gardening tools and supplies. The air is thick with the smell of soil and wood. A single window allows a sliver of moonlight to illuminate the cobwebs in the corners. There is a small closet can be used to hide from the monster.",
        "SHED",
        std::list<std::string>{"GARDEN", "SHED CLOSET"}, // Only accessible back to the Garden
        shedDoors, // Use the empty shed doors
        shedItems // Vector containing only a pill bottle
    );

    // Hedge Maze Room
    rooms["HEDGE MAZE"] = RoomClass(
        "You find yourself in a sprawling hedge maze. Tall hedges tower around you, creating a sense of disorientation. The paths are winding and the sound of rustling leaves fills the air. You sense that there might be hidden corners to explore.",
        "HEDGE MAZE",
        std::list<std::string>{"GARDEN", "MAZE EXIT"}, // Only accessible back to the Garden
        mazeExitDoors, // Use the empty maze doors
        hedgeMazeItems // items in the maze
    );

    rooms["HEDGE MAZE EXIT"] = RoomClass("You exit the hedge maze into a small clearing with a bird fountain. This place seems very calm, almost safe.", "HEDGE MAZE EXIT", std::list<string> {"HEDGE MAZE"}, mazeExitDoors, mazeExitItems);

    // Fountain Room
    rooms["FOUNTAIN"] = RoomClass(
        "You arrive at a beautifully ornate fountain, its waters sparkling in the sunlight. The sound of water gently cascading down creates a soothing atmosphere. Surrounding the fountain are blooming flowers and lush greenery, adding to the serenity of the space.",
        "FOUNTAIN",
        std::list<std::string>{"GARDEN"}, // Only accessible back to the Garden
        fountainDoors, // Use the empty fountain doors
        fountainItems // No items at the fountain
    );

    //-----------------------------------//
    //Candle Sequence 5


    MemoryPuzzle memoryPuzzle = MemoryPuzzle("Memory Puzzle"); //instance for the memory puzzle
    InteractClass* memoryPuzzleStarterInteraction = new InteractClass("A memory tank", "Test", memoryPuzzle);//interaction that runs the memory puzzle
    ItemClass memoryPuzzleStarter = ItemClass("MEMORY TANK", "A crystal tank that is labeled as MEMORY TANK. There is a hand inprint on the tank.", false, memoryPuzzleStarterInteraction); //item in THE LIFT to start puzzle
    ItemClass playerMemory = ItemClass("YOUR MEMORY", "A glowing orb, reminiscent of your past.", "YOURMEMORY", true, true); //Reward for completing memory puzzle
    bool memoryGobletIsActive = false; //boolean to determine whether memory goblet is active or not 


    ChantPuzzle chantPuzzle = ChantPuzzle("Chant Puzzle"); //instance for chant puzzle 
    InteractClass* chantPuzzleStarterInteraction = new InteractClass("A chanting altar", "Test", chantPuzzle); //interaction to run puzzle
    ItemClass chantPuzzleStarter = ItemClass("CHANTING ALTAR", "A CHANTING ALTAR, there appears to be a 4 word phrase ingraved on the altar, but its been scrached away",false, chantPuzzleStarterInteraction); //item you can interact with
    ItemClass Candle5 = ItemClass("CANDLE", "The 5th and Final Candle.", "C5", true, true); //declaration for candle




    InteractClass* gobletInteraction = new InteractClass("Approch the goblet", "You interact with the goblet");//item in THE CONSCIOUS that allows user to put the item playerMemory
    ItemClass memoryGoblet = ItemClass("MEMORY GOBLET", "A transparent chalice with the logo of an eye called the MEMORY GOBLET, a place where memories can be added.", false, gobletInteraction); //interaction for memory goblet

    ItemClass Sight = ItemClass("SIGHT", "Allows you to see the unseen.", true, true); //item awarded from putting playermemory into the goblet 

    std::vector<Door> memoryOfTheMansionDoors = {}; //doors for MemoryOfThe Mansion
    std::vector<ItemClass> memoryOfTheMansionItems = {};//items for Memory Of The Mansion

    std::vector<Door> memoryOfTheFoyerDoors = {}; //Doors inside the memory of the foyer
    std::vector<ItemClass> memoryOfTheFoyerItems = {}; //items inside the memory of the foyer

    std::vector<Door> memoryOfTheLibraryDoors = {}; //doors inside the memory of the library
    std::vector<ItemClass> memoryOfTheLibraryItems = {};//items inside memory  of the library

    std::vector<Door> memoryOfTheGardenDoors = {}; //doors inside memory of the garden
    std::vector<ItemClass> memoryOfTheGardenItems = {}; //items inside memory of the garden

    std::vector<Door> memoryOfTheStudyDoors = {}; //doors inside memory of the study
    std::vector<ItemClass> memoryOfTheStudyItems = {}; //items inside memory of the study

    std::vector<Door> memoryOfTheAtticDoors = {}; //the doors inside the attic or AKA the LIFT
    std::vector<ItemClass> memoryOfTheAtticItems = { memoryPuzzleStarter }; //memory puzzle item inside the attic

    std::vector<Door> theConsciousDoors = {}; //doors for the CONSCIOUS
    std::vector<ItemClass> theConsciousItems = { memoryGoblet , chantPuzzleStarter };// items in THE CONSCIOUS has memory goblet and chant puzzle started

    


    //room declaration for memory of the mansion
    rooms["MEMORY OF THE MANSION"] = RoomClass("You arrive in a broken mansion, it looks familiar but different. It is the mansion from the monster's memories. You are no longer in your reality, but a twisted one where the mansion has been destroyed and its debris are lingering in the air. There are portraits and pieces of the staircase floating in the air with a pink nebula in the background.",
        "MEMORY OF THE MANSION",
        std::list<std::string>{"MEMORY TABLE","MEMORY OF THE FOYER", "MEMORY OF THE LIBRARY", "MEMORY OF THE GARDEN", "MEMORY OF THE STUDY", "THE LIFT", "THE CONSCIOUS"},//adjacent rooms
        memoryOfTheMansionDoors,
        memoryOfTheMansionItems
    );

    rooms["MEMORY TABLE"] = RoomClass("You are now under the table. You are safe from any threats.", "MEMORY TABLE", std::list<std::string>{"MEMORY OF THE MANSION"}, false, true);

    //room for declaration of memory of the foyer
    rooms["MEMORY OF THE FOYER"] = RoomClass("You arrive to a broken foyer and you an see a floating statue and doors that are floating away from their hinges. Appartions of a family of f!?o^ur@ with their eyes blacked out watch you. You see the text UROTMU which appears to be scrambled.",
        "MEMORY OF THE FOYER",
        std::list<std::string>{"MEMORY OF THE MANSION"},//adjacent rooms
        memoryOfTheFoyerDoors,
        memoryOfTheFoyerItems,
        true, //boolean to determine if the room has a conditonal description
        "You arrive to a broken foyer and you an see a floating statue and doors that are floating away from their hinges. Appartions of a family of f!?o^ur@ with their eyes blacked out watch you. Adjecent to this room is MEMORY OF THE MANSION. The letters re-arrange to form: TUORUM."
        );//Conditional description to be displayed ^^
    //room for declaration of memory of the library
    rooms["MEMORY OF THE LIBRARY"] = RoomClass("You arrive to a broken library, books and bookshelfs are floating around. There is a woman lying on the floor with t$hr#@ee darts in her head. You see the text OACPMEURTC which appears to be scrambled.",
        "MEMORY OF THE LIBRARY",
        std::list<std::string>{"MEMORY OF THE MANSION"}, //adjacent rooms
        memoryOfTheLibraryDoors,
        memoryOfTheLibraryItems,
        true,//boolean to determine if the room has a conditonal description
        "You arrive to a broken library, books and bookshelfs are floating around. There is a woman lying on the floor with t$hr#@ee darts in her head. The letters re-arrange to form: PECCATORUM."
        //Conditional description to be displayed ^^
    );
    //room for declaration of memory of the garden
    rooms["MEMORY OF THE GARDEN"] = RoomClass("You arrive to a broken garden, the grass is no longer green and the hedgmaze has been burnt away.  There is o!(ne& figure all in black digging a gravestone with your name on it. You see the text GNXUIEET which appears to be scrambled.",
        "MEMORY OF THE GARDEN",
        std::list<std::string>{"MEMORY OF THE MANSION"},//adjacent rooms
        memoryOfTheGardenDoors,
        memoryOfTheGardenItems,
        true,//boolean to determine if the room has a conditonal description
        "You arrive to a broken garden. There is o!(ne& figure all in black digging a gravestone with your name on it. Adjacent to this room is MEMORY OF THE MANSION. The letters re-arrange to form: EXTINGUE."
        //Conditional description to be displayed ^^
    );
    //room for declaration of memory of the study
    rooms["MEMORY OF THE STUDY"] = RoomClass("You arrive to a broken study. On the desk sits a revolver with blood all around, as %t^w*o men lie lifeless on the desk with holes in their heads. You see the letters LMMMFAA.",
        "MEMORY OF THE STUDY",
        std::list<std::string>{"MEMORY OF THE MANSION"},//adjacent rooms
        memoryOfTheStudyDoors,
        memoryOfTheStudyItems,
        true,//boolean to determine if the room has a conditonal description
        "You arrive to a broken study. On the desk sits a revolver with blood all around, as %t^w*o men lie lifeless on the desk with holes in their heads. Adjacent to this room is MEMORY OF THE MANSION The letters re-arrange to form: FLAMMAM."
        //Conditional description to be displayed ^^
    );
    //room for declaration of memory of the lift
    rooms["THE LIFT"] = RoomClass("The beam of energy carries your body up to place that is unrecognizable, it appears to be an attic.",
        "THE LIFT",
        std::list<std::string>{"MEMORY OF THE MANSION"},//adjacent rooms
        memoryOfTheAtticDoors,
        memoryOfTheAtticItems
    );
    //room for declaration of memory of the conscious
    rooms["THE CONSCIOUS"] = RoomClass("You enter a new room that looks nothing like the mansion. It has an evil influence, as if you were inside the concious of the monster itself.",
        "THE CONSCIOUS",
        std::list<std::string>{"MEMORY OF THE MANSION"}, //adjacent rooms
        theConsciousDoors,
        theConsciousItems
    );
    
    std::string startingRoom = "A";
    bool puzzleSolved = false;

    PlayerClass userPlayer = PlayerClass(rooms["GARDEN"]);

    bool inputVal = false;
    userPlayer.setSanity(100);



    //Defining variables for timer
    MonsterClass monsterTimer(120, *this, userPlayer);
    monsterTimer.start();

    
    std::atomic<bool> running(true);

    std::thread sanityThread(&GameControllerClass::sanitySequence, this, std::ref(userPlayer), std::ref(running));

    UI.displayPrompt("It's always important to stay sane in such a stressful situation. The lower your sanity gets, the less you'll understand what is going on...\nUnfortunately, it is only a matter of time before you completely lose it. Consume SANITY PILLS to increase your sanity.");

    while (true) {

        if (monsterTimer.isTriggered())
        {
            monsterTimer.start(); //Resets monster timer to start again
        }
  

        UI.displayPrompt("\n"); //Giving space for text
        RoomClass& currentRoom_temp = userPlayer.getRoom(); //temp current room instance of roomClass to access room data

        if (currentRoom_temp.getHasConditionalDescription()) { //cond to check if the room has a specific conditonal rendering property
            if (inputVal == true) {
                system("cls");
                inputVal = false;
            }
            UI.displayPrompt(currentRoom_temp.conditionalDescription(userPlayer.getInventory(), Sight)); //display special condition
        }
        else {
            if (inputVal == true) {
                system("cls");
                inputVal = false;
            }
            UI.displayPrompt(currentRoom_temp.AmendDescription(), userPlayer.getSanity()); //display for rest of the rooms 
        }
        
        //UI.displayPrompt(userPlayer.getRoomDescription());
        //currentRoom_temp.displayRoomItems(); //Displaying room items, TEMP function until can implement into UI class
        //std::cout << endl;
       // currentRoom_temp.displayAdjacentRooms(); //Displaying adjacent rooms, TEMP function until can implement into UI class
        std::cout << endl;
        UI.displayPrompt("\nYou can't contain your curiosity and have the urge to INSPECT the items in the room. (type 'INVENTORY' to open inventory. Type 'QUIT' to exit the game)\n"); //user input 
        

        std::string command = UI.userInput();

        // Boolean to track whether the kitchen door is open
        bool kitchenDoorOpen = false;
        

        //bool to track if player put memory in memory goblet



        // Check the command for the kitchen door
        if (command == "KITCHEN DOOR" && userPlayer.getRoomName() == "KITCHEN" && rooms.find("FOYER") != rooms.end()) {
            system("cls");
            // Player is in the kitchen and wants to enter the foyer through the door
            if (!kitchenDoorOpen) {
                UI.displayPrompt("\nYou open the door to the foyer.\n");
                kitchenDoorOpen = true;  // Door remains open after first use
            }
            userPlayer.setRoom(rooms["FOYER"]);  // Move player to the foyer

            // Add "KITCHEN" as an option in the foyer room only if its not already there
            auto currentRoom_temp = rooms["FOYER"];
            std::list<std::string> updatedOptions = currentRoom_temp.GetRoomOption();

            // Check if "KITCHEN" is already in the options
            if (std::find(updatedOptions.begin(), updatedOptions.end(), "KITCHEN") == updatedOptions.end()) {
                updatedOptions.push_back("KITCHEN");

                // Remove "KITCHEN DOOR" if its already in the options
                updatedOptions.remove("KITCHEN DOOR");

                // Update the options in the foyer
                currentRoom_temp.setRoomOption(updatedOptions);

                // Update the foyer room in the map
                rooms["FOYER"] = currentRoom_temp;
            }

            UI.displayPrompt("\nYou are now in the foyer. You can use the 'KITCHEN' command to return to the kitchen.\n");
        }

        else if (command == "KITCHEN DOOR" && userPlayer.getRoomName() == "FOYER") {
            system("cls");
            // Allow access back to the kitchen if the door is open
            if (kitchenDoorOpen) {
                UI.displayPrompt("\nYou pass through the open door to the kitchen.\n");
                userPlayer.setRoom(rooms["KITCHEN"]);  // Move player back to the kitchen
                PlaySound(TEXT("DoorUnlock.wav"), NULL, SND_FILENAME | SND_ASYNC);
            }
            else {
                UI.displayPrompt("\nThe door to the kitchen is locked from this side.\n");
            }
        }

        // Boolean to track whether the dining hall door is open
        bool diningHallDoorOpen = false;

        // Check the command for the dining hall door
        if (command == "DINING HALL DOOR" && userPlayer.getRoomName() == "DINING HALL" && rooms.find("LOUNGE") != rooms.end()) {
            // Player is in the dining hall and wants to enter the lounge through the door
            if (!diningHallDoorOpen) {
                system("cls");
                UI.displayPrompt("\nYou open the door to the lounge.\n");
                diningHallDoorOpen = true;  // Door remains open after first use

            }
            userPlayer.setRoom(rooms["LOUNGE"]);  // Move player to the lounge

            // Add "DINING HALL" as an option in the lounge room only if it�s not already there
            auto currentRoom_temp = rooms["LOUNGE"];
            std::list<std::string> updatedOptions = currentRoom_temp.GetRoomOption();

            // Check if "DINING HALL" is already in the options
            if (std::find(updatedOptions.begin(), updatedOptions.end(), "DINING HALL") == updatedOptions.end()) {
                updatedOptions.push_back("DINING HALL");
                updatedOptions.remove("DINING HALL DOOR"); // Remove the dining hall door as an option in the foyer 
                currentRoom_temp.setRoomOption(updatedOptions);

                // Update the lounge room in the map
                rooms["LOUNGE"] = currentRoom_temp;
            }

            UI.displayPrompt("\nYou are now in the lounge. You can use the 'DINING HALL' command to return to the dining hall.\n");
        }
        else if (command == "DINING HALL" && userPlayer.getRoomName() == "LOUNGE") {
            system("cls");
            // Allow access back to the dining hall if the door is open
            if (diningHallDoorOpen) {
                system("cls");
                UI.displayPrompt("\nYou pass through the open door to the dining hall.\n");
                userPlayer.setRoom(rooms["DINING HALL"]);  // Move player back to the dining hall
                PlaySound(TEXT("DoorOpen.wav"), NULL, SND_FILENAME | SND_ASYNC);
            }
            else {
                system("cls");
                UI.displayPrompt("\nThe door to the dining hall is locked from this side.\n");
            }
        }
        else if (command == "DINING HALL DOOR" && userPlayer.getRoomName() == "LOUNGE") {
            system("cls");
            UI.displayPrompt("The DINING HALL DOOR is locked from this side\n");
        }
        /*--------------------- CANDLE PLACEMENT LOGIC START ----------------------*/
        if (command == "CANDLE" && userPlayer.getRoomName() == "RITUAL ROOM") {
            if (userPlayer.getInventorySize() != 0) {
                if (userPlayer.inInventory("CANDLE", "C1")) {

                    isInProtectedAction = true;
                    system("cls");
                    userPlayer.useItem("CANDLE", "C1"); // Uses Candle from inventory, is removed
                    PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    UI.displayPrompt("You have placed a candle.\n");
                    currentRoom_temp.addCandle();
             

                    // Display the pentagram immediately after placing the candle
                    UI.displayPentacle(currentRoom_temp.getCandleValue());
                    std::this_thread::sleep_for(std::chrono::seconds(10));


                    // Open the tunnel to the kitchen
                    UI.displayPrompt("As you place the candle, a hidden tunnel opens, leading to the kitchen!\n");
                    PlaySound(TEXT("TunnelOpening.wav"), NULL, SND_FILENAME | SND_ASYNC);

                    UI.displayPrompt("A significant symbol appears in your path:\n");
                    UI.displayPrompt("M\n");

                    // Add "KITCHEN" to the list of accessible rooms from the ritual room
                    std::list<std::string> updatedOptions = currentRoom_temp.GetRoomOption();
                    updatedOptions.push_back("KITCHEN");
                    currentRoom_temp.setRoomOption(updatedOptions);

                    // Update the room in the map
                    rooms["RITUAL ROOM"] = currentRoom_temp;

                    isInProtectedAction = false;
                    continue;
                }
                else if (userPlayer.inInventory("CANDLE", "C2"))
                {
                     isInProtectedAction = true;
                     system("cls");
                     userPlayer.useItem("CANDLE", "C2");     //Uses the specified candle with its id to be used
                     UI.displayPrompt("You have placed the 2nd candle.\n");


                     PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                     UI.displayPentacle(currentRoom_temp.getCandleValue());
                     std::this_thread::sleep_for(std::chrono::seconds(12));

                     currentRoom_temp.addCandle();
                  

                     UI.displayPrompt("As you place the candle, a portal is revealed!\n");

                     UI.displayPrompt("A significant symbol appears in your path:\n");
                     UI.displayPrompt("A\n");

                     PlaySound(TEXT("Portal Opening.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        
                     std::list<std::string>updatedOptions = currentRoom_temp.GetRoomOption();
                     updatedOptions.push_back("PORTAL");
                     currentRoom_temp.setRoomOption(updatedOptions);
                    
                     //Update the room in the map
                     rooms["RITUAL ROOM"] = currentRoom_temp;
                     isInProtectedAction = false;
                    continue;
                }
                else if (userPlayer.inInventory("CANDLE", "C3")) {
                    isInProtectedAction = true;
                    system("cls");
                    UI.displayPrompt("You place the 3rd candle.");
       
                    userPlayer.useItem("CANDLE", "C3"); //use the candle

                    PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    UI.displayPentacle(currentRoom_temp.getCandleValue());
                    std::this_thread::sleep_for(std::chrono::seconds(12));

                    UI.displayPrompt("A significant symbol appears in your path:\n");
                    UI.displayPrompt("L\n");

                    std::this_thread::sleep_for(std::chrono::seconds(8));
                    isInProtectedAction = false;

                }
                else if (userPlayer.inInventory("CANDLE", "C4")) // candle 4 placed conditon TODO: Add functionality for 4th and possible 5th candle to be printed on screen
                {
                    isInProtectedAction = true;
                    system("cls");
                    UI.displayPrompt("You place the 4th candle.");

                    PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    UI.displayPentacle(currentRoom_temp.getCandleValue());
                    std::this_thread::sleep_for(std::chrono::seconds(12));

                    UI.displayPrompt("A significant symbol appears in your path:\n");
                    UI.displayPrompt("U\n");

                    std::this_thread::sleep_for(std::chrono::seconds(6)); //DRAMATIC PAUSE
                    userPlayer.useItem("CANDLE", "C4"); //use the candle
                    userPlayer.setRoom(rooms["MEMORY OF THE MANSION"]); //set user to teleport to memory of mansion
                    playTeleportSequence(); // CALL CANDLE STYLIZE SEQUENCE
                    std::this_thread::sleep_for(std::chrono::seconds(3)); //DRAMATIC PAUSE 2 AFER SEQUENCE
                    system("cls");
                    isInProtectedAction = false;
                    continue;
                }
                else if (userPlayer.inInventory("CANDLE", "C5")) { //candle 5 placed condition
                    isInProtectedAction = true;
                    system("cls");

                    UI.displayPrompt("It is final...");

                    PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    UI.displayPentacle(currentRoom_temp.getCandleValue());
                    std::this_thread::sleep_for(std::chrono::seconds(12));

                    UI.displayPrompt("A significant symbol appears in your path:\n");
                    UI.displayPrompt("M\n");

                    std::this_thread::sleep_for(std::chrono::seconds(7)); //DRAMATIC PAUSE

                    system("cls");
                    endingSequence(UI);
                    std::this_thread::sleep_for(std::chrono::seconds(3)); //pause after ext 
                    endGame("\nThank you for playing."); 
                    isInProtectedAction = false;
                }
                else
                {
                    UI.displayPrompt("You do not have a candle");
                    continue;
                }
                /*--------------------- CANDLE PLACEMENT LOGIC END ----------------------*/
            }
        }

        if (command == "QUIT") {
            monsterTimer.stop();
            monsterTimer.join(); //Destory monster timer
            endGame();  // Call endGame method
            return;  // Exit the game loop
        }

        if (command == "SANITY") {
            system("cls");
            UI.displayPrompt("SANITY: " + std::to_string(userPlayer.getSanity()));
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
            system("cls");
            continue;
        }
        
        else if (command == "ESCAPE") //Handles when monster grabs player
        {
            UI.displayPrompt("You manage to escape the grasp of the monster and are back in the same room you just were in.");
        }
      
        else if (command == "INVENTORY")
        {
            isInProtectedAction = true;
            system("cls");
            viewInventory(userPlayer); //Call view inventory function
            UI.displayPrompt("\n");
            isInProtectedAction = false;
        }
        else if (command == "INSPECT") //If user wants to pick up item
        {
            if (currentRoom_temp.getItems().empty()) {
                system("cls");
                UI.displayPrompt("This room contains no items");
            }

            else {
                /*------------START INSPSECT SEQUENCE----------------*/
                isInProtectedAction = true;
                system("cls");
                currentRoom_temp.displayRoomItems();
                UI.displayPrompt("What item would you like to inspect?\n");
                command = UI.userInput(); //Getting item to be picked up 

                if (currentRoom_temp.getRoomItemByName(command).getName() == command) //Checks if there is an item in the room same as item user wants to inspect
                {
                    std::string itemName = command;
                    std::cout << endl;
                    UI.displayPrompt(currentRoom_temp.getRoomItemByName(itemName).getDescription());
                    std::cout << endl;

                    if (currentRoom_temp.getRoomItemByName(itemName).getCanPickUp() == true) //Run Pick up sequence
                    {
                        UI.displayPrompt("Type PICKUP to pick up the item");
                        command = UI.userInput();

                        if (command == "PICKUP")
                        {
                            system("cls");
                            if (currentRoom_temp.getRoomItemByName(itemName).getCanPickUp() == true) //Run pick up sequence
                            {
                                for (int i = 0; i < currentRoom_temp.getItemsLength(); i++)
                                {
                                    ItemClass& itm = currentRoom_temp.getItems().at(i); //Looping through each item in room to check if exists
                                    //std::cout << itm.getName();
                                    if (itm.getName() == itemName)
                                    {
                                        PickUpItemClass pickUp(itm); //Picking up item the user requested to pick up
                                        //std::cout << "Attempting to play sound" << endl; 
                                        itm.playItemSound();

                                    if (itm.getSoundFileName() == "")
                                    {
                                        PlaySound(TEXT("General Pickup.wav"), NULL, SND_FILENAME | SND_ASYNC);
                                    }
                                    itm.getSoundFileName();
                                    pickUp.addToInventory(userPlayer);
                                    currentRoom_temp.RemoveItem(itm);
                                    rooms[currentRoom_temp.GetName()] = currentRoom_temp;
                                    userPlayer.setRoom(currentRoom_temp);
                                    std::cout << std::endl;
                                    std::cout << "You picked up " << itemName << "." << std::endl << std::endl;
                                    std::cout << "-----------" << std::endl;

                                    // Check if the picked-up item is CANDLE C4
                                    if (itemName == "CANDLE" && currentRoom_temp.GetName() == "HEDGE MAZE EXIT")
                                    {
                                        // Portal logic
                                        system("cls");
                                        UI.displayPrompt("As you pick up the 4th candle, a surge of energy flows through the room...");
                                        std::this_thread::sleep_for(std::chrono::seconds(2)); // Dramatic pause
                                        // Portal opening prompt
                                        UI.displayPrompt("A mysterious portal materializes before you, shimmering with eldritch energy...");
                                        std::this_thread::sleep_for(std::chrono::seconds(2)); // Pause to emphasize portal appearance

                                        // Teleport to Ritual Room
                                        UI.displayPrompt("The portal pulls you in... You are heading to the Ritual Room.");
                                        userPlayer.setRoom(rooms["RITUAL ROOM"]); // Set destination to the Ritual Room

                                        playTeleportSequence(); // Play teleportation sequence animation
                                        std::this_thread::sleep_for(std::chrono::seconds(3)); // Pause after teleport sequence

                                        system("cls"); // Clear the screen before transitioning to the new room
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    ;

                }
                else if (command == "MEMORY GOBLET") {

                        if (memoryGobletIsActive) {
                            UI.displayPrompt("You dunk your head into the goblet and you are granted SIGHT.");
                            userPlayer.addItem(Sight);
                            UI.userInput();

                        }
                        else if (userPlayer.inInventory("YOUR MEMORY")) {
                            UI.displayPrompt("You place YOUR MEMORY into the MEMORY GOBLET and it unleashes a blue flame as it roars to life.");
                            userPlayer.useItem(playerMemory);
                            memoryGobletIsActive = true;
                            UI.userInput();
                        }
                        else {
                            UI.displayPrompt("You approch the tank of memories, however you lack the item that must go here... you walk away.");
                            UI.userInput();
                            std::cout << memoryGobletIsActive;

                        }

                    }
                    else if (command == "METAL SAFE")
                    {
                        UI.displayPrompt("Enter the 4 digit code");
                        string safeInput = UI.userInput();

                        try {
                            int safeInputNum = std::stoi(safeInput);

                            if (safeInputNum == 8691)
                            {
                                UI.displayPrompt("You entered the correct passcode! Safe is now open and there's a key");
                                PlaySound(TEXT("SafeOpening.wav"), NULL, SND_FILENAME | SND_ASYNC);
                                rooms["DINING HALL"].RemoveItem(metalSafe);
                                rooms["DINING HALL"].AddItem(greaterLibraryKey);
                                rooms["DINING HALL"].displayRoomItems();

                            }
                            else{
                                system("cls");
                                UI.displayPrompt("You entered the wrong passcode. Try again\n");
                            }
                        }
                        catch (const std::invalid_argument& e) {
                            system("cls");
                            UI.displayPrompt("You entered the wrong passcode. Try again\n");
                        }
                    }


                    else if (currentRoom_temp.getRoomItemByName(itemName).getInteraction()->getIsPuzzle() == true) //If interaction is a puzzle, call overloaded runInteraction
                    {
                        currentRoom_temp.getRoomItemByName(itemName).getInteraction()->runInteraction(userPlayer, studyKey, galleryKey, mirrorKey, masterKey, mazeKey, mazeExitKey, playerMemory, Candle5); //Clunky solution right now, considering using an extra if statement to confirm player is in upstairs or gallery to call this puzzle

                        if (userPlayer.inInventory("CANDLE", "C5")) { // condition that finds whether user get candle 5, whic specifically occurs right after they complete the chant puzzle sequence
                            system("cls");
                            UI.displayPrompt("The monster roars awake.");
                            
                            PlaySound(TEXT("MonsterCandeRoar.wav"), NULL, SND_FILENAME | SND_ASYNC);
                            std::this_thread::sleep_for(std::chrono::seconds(9));
                            UI.displayPrompt("You recieve the final candle, its waiting to be set down on the pentagrams edge");
                            std::this_thread::sleep_for(std::chrono::seconds(4));
                            userPlayer.setRoom(rooms["RITUAL ROOM"]);
                        }

                    }
                    else //Run interact sequence if not pick up able object
                    {
                        currentRoom_temp.getRoomItemByName(itemName).getInteraction()->runInteraction();
                    }
                }

                isInProtectedAction = false;
            }
            /*-----------------END INSPSECT SEQUENCE------------------*/
        }
        else {
            //std::string current_room = userPlayer.getRoomName();
           
            std::list<std::string> validInputs = currentRoom_temp.GetRoomOption();
            if (std::find(validInputs.begin(), validInputs.end(), command) != validInputs.end()) //algorithm to parse command in valid room options
            {
                /*before you read: THIS IS A TEMPORARY FUNCTIONALITY FOR ROOM DETECTION THIS WILL BE REFACTORED WHEN WE DECIDE HOW TO BUILD OUR MAP
                TODO: setup hashmap for corresponding rooms, implement functionality to minimize conditional nesting*/
                if (rooms.find(command) != rooms.end()) {
                    system("cls");
                    std::string previousRoom = userPlayer.getRoomName(); //to store previous room name
                    userPlayer.setRoom(rooms[command]);
                    if (!(command == "PORTAL" || command == "BOOKSHELF"))
                    {
                        if (command == "HIDDEN SECTION") {
                            PlaySound(TEXT("Walk Down Stairs.wav"), NULL, SND_FILENAME | SND_ASYNC);       
                        }
                        else if ((command == "LIBRARY") && (previousRoom == "HIDDEN SECTION")) {
        
                             PlaySound(TEXT("Walk Down Stairs.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else if ((command == "KITCHEN")&& (previousRoom == "RITUAL ROOM") ){

                            PlaySound(TEXT("Walking Through Tunnel.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else if ((command == "HEDGE MAZE EXIT") || (command == "HEDGE MAZE" && previousRoom == "HEDGE MAZE EXIT") || (command == "HEDGE MAZE" && previousRoom == "GARDEN"))
                        {
                            PlaySound(TEXT("Walking Through Tunnel.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else if (command == "FOUNTAIN" || command == "GRAVEYARD" || command == "GARDEN")
                        {
                            PlaySound(TEXT("Walking Through Tunnel.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else if (command == "THE LIFT") {
                            PlaySound(TEXT("Portal Opening.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else if (command == "MEMORY OF THE MANSION" && previousRoom == "THE LIFT")
                        {
                            PlaySound(TEXT("Portal Opening.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                        else {
                            PlaySound(TEXT("DoorOpen.wav"), NULL, SND_FILENAME | SND_ASYNC);
                        }
                    }
                    isInProtectedAction = userPlayer.getRoom().getIsSafe(); //checking to see if user is in a safe room

                    if (isInProtectedAction) {
                        monsterTimer.reset(); //if user is in a safe room then timer is reset
                    }
                }
                else if (command == "PORTAL") {
                    system("cls");
                    PlaySound(TEXT("TeleportUpstairs.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    if (userPlayer.getRoom().GetName() == "UPSTAIRS") {
                        userPlayer.setRoom(rooms["RITUAL ROOM"]);  // If user is upstairs, return to the Ritual Room via the portal
                        UI.displayPrompt("You step through the portal and find yourself back to the Ritual Room");
                    }
                    else {
                        userPlayer.setRoom(PORTAL);  // Move to the portal room first
                        UI.displayPrompt("You have entered the portal and now find yourself upstairs.");
                        userPlayer.setRoom(rooms["UPSTAIRS"]);  // Automatically move to the upstairs room
                    }
                }
                else if (command == "DOUBLE DOORS") {
                    std::list<std::string> options = { "PORTAL", "MIRROR ROOM 1", "MIRROR ROOM 2", "STORYTELLER'S ROOM", "GALLERY", "MASTER BEDROOM" };
                    handleDoors(userPlayer, currentRoom_temp, "MASTER BEDROOM", options, rooms,"", command);
                }
                else if (command == "DOOR") {
                    std::list<std::string> options = { "LOUNGE", "LIBRARY", "KITCHEN DOOR" };
                     UI.displayPentacle(currentRoom_temp.getCandleValue());
                    handleDoors(userPlayer, currentRoom_temp, "LIBRARY", options, rooms,"", command);
                }
                else if (command == "GREATER LIBRARY DOOR")
                {
                    std::list<std::string> options = {"FOYER", "HIDDEN SECTION", "LIBRARY","GREATER LIBRARY"};
                    handleDoors(userPlayer, currentRoom_temp, "GREATER LIBRARY", options, rooms, "", command);
                }
                else if (command == "BOOKSHELF") {
                    std::list<std::string> options = { "FOYER","HIDDEN SECTION", "GREATER LIBRARY DOOR" };
                    handleDoors(userPlayer, currentRoom_temp, "HIDDEN SECTION", options, rooms, "You place the book on the shelf. The Bookshelf begins to move, screeching across the wooden floor. It reveals a staircase leading down to the HIDDEN SECTION. \n\n", command);
                }
                else if (command == "BLOCKED HEDGE MAZE")
                {
                    std::list<std::string> options = { "SHED", "FOUNTAIN", "HEDGE MAZE"};
                    handleDoors(userPlayer, currentRoom_temp, "HEDGE MAZE", options, rooms, "You pour the holy water on the dark force blocking the entrance to the hedge maze, granting yourself access as the dark sludge burns away.\n\n", command);
                }
                else if (command == "MAZE EXIT")
                {
                    std::list<std::string> options = { "GARDEN", "HEDGE MAZE EXIT"};
                    handleDoors(userPlayer, currentRoom_temp, "HEDGE MAZE EXIT", options, rooms, "", command);
                }
                else if (command == "STUDY DOOR")
                {
                    std::list<std::string> options = { "LIBRARY", "STUDY" };
                    handleDoors(userPlayer, currentRoom_temp, "STUDY", options, rooms, "", command);
                }
            }
            else
            { 
                inputVal = true;
            }
        }
    }
    UI.displayPrompt("\nGOODBYE."); // temp text here for when the loop exits u
}



void GameControllerClass::showMenu() {
    while (true) {
        // Display the main menu
        UI.displayPrompt("\n--- Main Menu ---");
        UI.displayPrompt("Type one of the following options:");
        UI.displayPrompt("START - Start the game");
        UI.displayPrompt("HELP - View instructions");
        UI.displayPrompt("CREDITS - View developer credits");
        UI.displayPrompt("QUIT - Exit the game");

        // Get user input
        std::string input = UI.userInput();

        if (input == "START") {
            // Start the game
            system("cls");
            displayBackstory();
            system("cls");
            gameLoop();
            // After the game ends, show the menu again
        }
        else if (input == "HELP") {
            // Display instructions
            system("cls");
            UI.displayPrompt("\n--- Instructions ---");
            UI.displayPrompt("\n");
            UI.displayPrompt("All keywords and interactable items/rooms are in ALL CAPS");
            UI.displayPrompt("Examples: INSPECT, PICKUP, GARDEN.");
            UI.displayPrompt("\n");

            UI.displayPrompt("Commands to check your status: \n \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("INSPECT: Displays any interactable items/puzzles/consumables in your current room, allowing you to type one to interact with it.\n \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("INVENTORY: Displays items in your inventory, you use consumables like SANITY PILLS here. \n \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("SANITY: Displays your current sanity, go low enough and your vision may become sCraMbLEd. Any lower and you will die.\n \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("\n");

            UI.displayPrompt("How to move around: \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("Type name of an adjacent room to traverse to it. (If you see it says DOOR instead that means you probably need a key to open it. \n \n");
            UI.displayPrompt("\n");
            UI.displayPrompt("Keep an eye out for hiding spots, you may need them at some point.");
            
            UI.displayPrompt("\n");
            UI.displayPrompt("\n");
            UI.displayPrompt("Press Enter to return to the main menu...");
            UI.userInput(); // Wait for user to press Enter
            system("cls");
        }
        else if (input == "CREDITS") {
            // Display developer credits
            system("cls");
            UI.displayPrompt("\n--- Credits ---");
            UI.displayPrompt("Game developed by: BTS! ");
            UI.displayPrompt("Press Enter to return to the main menu...");
            UI.userInput(); // Wait for user to press Enter
            system("cls");
        }
        else if (input == "QUIT") {
            // End the game
            system("cls");
            endGame();
            return; // Exit the menu loop and terminate the application
        }
        else {
            // Invalid input
            system("cls");
            UI.displayPrompt("Invalid choice. Please try again.\n");
        }
    }
}

void GameControllerClass::endGame() {
    system("cls");
    UI.displayPrompt("\nYour world disappears around you. You are still aware but there is nothing, like someone pulled the plug on your brain - Am I dead?\n...You wonder if this will end.\nThank you for playing");
    exit(0);  // Exit the game
}


void GameControllerClass::handleDoors(PlayerClass& player, RoomClass& currentRoom, const std::string& targetRoom, const std::list<std::string>& newRoomOptions, std::unordered_map<std::string, RoomClass>& rooms, const std::string& openMessage, std::string command)
{
    system("cls");
    std::vector<Door>& doors = currentRoom.GetDoors();
    bool wasKeyFound = false; //To track if a key was found that unlocks door

    for (int i = 0; i < doors.size(); i++) {
        if (doors[i].getIsLocked()) {
            if (player.getInventorySize() != 0) {

                std::string playerKey = player.searchForKey(doors[i].getDoorKeyID());
              
               


                if (doors[i].getDoorKeyID() == playerKey && command == doors[i].getDoorName())
                {
                    if (command == "BOOKSHELF") {
                        PlaySound(TEXT("Bookshelf Open.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    }
                    else if (command == "BLOCKED HEDGE MAZE" || command == "HEDGE MAZE") {
                        PlaySound(TEXT("HolyWaterPour.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    }
                    else if (command == "MAZE EXIT") {

                        PlaySound(TEXT("HolyWaterPour.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    }
                     
                    else {
                        PlaySound(TEXT("DoorUnlock.wav"), NULL, SND_FILENAME | SND_ASYNC);
                    }
                    std::cout << openMessage;
                    player.useKey(playerKey); //Uses correct key from inventory
                    //UI.displayPrompt("You unlock the door with the key in your pocket, you can now traverse to the " + targetRoom + ".\n");
                    currentRoom.unlockDoor(i); //unlocks door, sets description to different openDoor description through
                    doors[i].unlockDoor();
                    currentRoom.setRoomOption(newRoomOptions); //set options to new, this is TEMPORARY solution and there will be refactor which includes function within room class to find the option to modify instead of setting it explicity
                    player.setRoom(currentRoom); //set room
                    wasKeyFound = true; //Sets to true to display the locked message once
                    break;
                }
                else
                {
                    //UI.displayPrompt("The door is locked");
                }
            }
            else
            {
                //UI.displayPrompt("The door is locked");
            }
        }
        else
        {
            //player.setRoom(rooms[targetRoom]);
            //currentRoom_temp = userPlayer.getRoom();

        }


    }

    if (!wasKeyFound)
    {
        UI.displayPrompt("The door is locked.");
    }
    else
    {
        UI.displayPrompt("You unlocked the door!");
    }
}

void GameControllerClass::sanitySequence(PlayerClass& userPlayer, std::atomic<bool>& running) {
    while (running) {
        int sanity = userPlayer.getSanity();
        userPlayer.setSanity(sanity - 1);

        std::this_thread::sleep_for(std::chrono::seconds(9));


        if (userPlayer.getSanity() < 2) {
            endGame();
        }
    }
}
 
void GameControllerClass::updateSanity(PlayerClass& player, int amount)
{
    int lowerBound = 0;
    int upperBound = 100;
    player.setSanity(std::max(lowerBound, std::min(upperBound, player.getSanity() + amount)));
}

void GameControllerClass::updateSanityGrabbed(PlayerClass& player) {
    player.setSanity(player.getSanity() - 30);

}



bool GameControllerClass::inProtectedState() {
    return isInProtectedAction;
}

void GameControllerClass::playTeleportSequence()
{
    //THIS FUNCTION IS A STYLISTIC FUNCTION FOR THE 4TH CANDLE SEQUENCE
    for (int i = 0;i < 10000;i++) {
        std::cout << "WHERE AM I GOING";
        if (i % 30 == 0 && i < 3000) {
            std::cout << "HELP ME\n";
        }
        if (i > 1500) {
            std::cout << "THERE IS NO COMING BACK NOW";
        }
    }
    system("cls");
}

void GameControllerClass::endingSequence(UserInterfaceClass UI) {
    UI.displayPrompt("I AM...\n");
    // stylized sequence for demon intro
    for (int i = 0; i < 2; i++) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        UI.displayPrompt("I AM\n");
    }
    bool neutralSequence = false; // value that indicates whether user has entered MALUM and got the neutral ending
    bool goodSequence = false; //Indicates the user got the good ending (entered HENRY)
    for (int i = 0; i < 3; i++) {
        if (goodSequence == true)
        { 
            break; //If good ending true, end sequence there
        }
        UI.displayPrompt("SAY MY NAME");
        std::string command = UI.userInput();

        transform(command.begin(), command.end(), command.begin(),::toupper); //convert input to uppercase , user can input name in any combination of cases

        if (command == "MALUM") {
            neutralSequence = true; // if name is MALUM flag neutral ending
        }
        else if (command == "HENRY")
        {
            goodSequence = true; //if name is HENRY flag good ending
        }
    }
    if (neutralSequence == false && goodSequence == false)
    {
        //Bad ending
        std::istringstream stream(GameControllerClass::badEnding);
        std::string line;

        while (std::getline(stream, line)) { //algorithm to display ending line by line, user will press enter via waitForInput() function form UI class
            UI.displayPrompt(line);
            UI.waitForInput();
        }
    }
    else if (neutralSequence == true && goodSequence == false)
    {
        std::istringstream stream(GameControllerClass::neutralEnding);
        std::string line;

        while (std::getline(stream, line)) { //algorithm to display ending line by line, user will press enter via waitForInput() function form UI class
            UI.displayPrompt(line);
            UI.waitForInput();
        }
    }
    else if(goodSequence == true){ 
        std::istringstream stream(GameControllerClass::goodEnding);
        std::string line;

        while (std::getline(stream, line)) { //algorithm to display ending line by line, user will press enter via waitForInput() function form UI class
            UI.displayPrompt(line);
            UI.waitForInput();
        }
    }
}

void GameControllerClass::endGame(std::string flavorText) {
    system("cls");
    UI.displayPrompt(flavorText); //
    showMenu();     //After game is completed, it will show the main menu now
    
}


