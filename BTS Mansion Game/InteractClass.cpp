#include "InteractClass.h"
// Constructor
InteractClass::InteractClass() {
    inputMessage = "";
    interactMessage = "";
    interacted = false;
    isPuzzle = false;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg) {
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    isPuzzle = false;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, GreaterLibraryPuzzle puzz) { //Constructor for greater library puzzle
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    gPuzzle = puzz;
    isPuzzle = true;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, GalleryPuzzle puzz) { //Constructor for gallery puzzle
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    puzzle = puzz;
    isPuzzle = true;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, MirrorPuzzle puzz) { //constructor for mirror puzzle
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    mPuzzle = puzz;
    isPuzzle = true;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, FountainPuzzle puzz) //constructor for fountain puzzle
{
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    fPuzzle = puzz;
    isPuzzle = true;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, MazePuzzle puzz) //constructor for fountain puzzle
{
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    maPuzzle = puzz;
    isPuzzle = true;
}

InteractClass::InteractClass(std::string inMssg, std::string interactMssg, MemoryPuzzle puzz) //constructor for memory puzzle
{
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    memPuzzle = puzz;
    isPuzzle = true;
}
InteractClass::InteractClass(std::string inMssg, std::string interactMssg, ChantPuzzle puzz) //constructor for chant puzzle
{
    inputMessage = inMssg;
    interactMessage = interactMssg;
    interacted = false;
    chaPuzzle = puzz;
    isPuzzle = true;
}

// Function to set input message
void InteractClass::setInputMessage(const std::string& message) {
    inputMessage = message;
}

// Function to set output message
void InteractClass::setOutputMessage(const std::string& message) {
    interactMessage = message;
}

bool InteractClass::getIsPuzzle()
{
    return isPuzzle;
}

// Function to interact with item or object
void InteractClass::runInteraction() {
    UserInterfaceClass ui;
    //input interaction message;

    //simulate user input demonstrate
    if (isPuzzle == true)
    {
        if (puzzle.isSolved() == false)
        {
            ui.displayPrompt(inputMessage);
            if (ui.userInput() == "YES")
            {
                puzzle.runPuzzle();
            }
            else
            {
                ui.displayPrompt("You walk away.");
            }
        }
        else
        {
            ui.displayPrompt("This item seems dormant...");
        }
    }
    else {
        ui.displayPrompt(inputMessage);
        ui.displayPrompt("Enter INTERACT: ");
        ui.userInput();

        if (ui.getCurrentInput() == "INTERACT")
        {
            //output interaction message
            std::istringstream stm(interactMessage);
            std::string line;

            while (std::getline(stm, line)) { //algorithm to display story line by line, user will press enter via waitForInput() function form UI class
                ui.displayPrompt(line);
                ui.waitForInput();
            }
            system("cls");
            //ui.displayPrompt(interactMessage);
            system("cls");
        }
        else {
            ui.displayPrompt("You walk away.");
            ui.waitForInput();
            system("cls");
        }
    }
    
}

void InteractClass::runInteraction(PlayerClass& player, ItemClass& greaterLibraryItem, ItemClass& galleryItm, ItemClass& mirrorItm, ItemClass& masterItm, ItemClass& fountainItem, ItemClass& mazeItem, ItemClass& memoryItem, ItemClass& chantItem) { //Function to run an interaction with items and picking up
    UserInterfaceClass ui;
    //input interaction message;
    //simulate user input demonstrate
    if (isPuzzle == true) //Check if interaction is a puzzle
    {
        if (gPuzzle.getDescription() == "Greater Library Puzzle") //if in greater library puzzle
        {
            if (gPuzzle.isSolved() == false) //Is puzzle solved
            {
                gPuzzle.runPuzzle();

                if (gPuzzle.isSolved() == true) //If puzzle was solved
                {
                    player.addItem(greaterLibraryItem); //Add key reward to inventory
                }
            }
            else
            {
                ui.displayPrompt("This has already been unlocked."); //Already solved
            }
        }
        if (puzzle.getDescription() == "Gallery Puzzle") //if in gallery puzzle execute gallery puzzle
        {
            if (puzzle.isSolved() == false) //Is the puzzle solved
            {
                ui.displayPrompt(inputMessage);
                if (ui.userInput() == "YES")
                {
                    puzzle.runPuzzle();
                    if (puzzle.isSolved() == true)
                    {
                        PickUpItemClass pickup(galleryItm);
                        pickup.addToInventory(player);

                        std::vector <ItemClass>& inv = player.getInventory();
                        for (auto& item : inv)
                        {
                            if (item.getName() == "MIRROR HALF KEY")
                            {
                                player.useKey(item.getKeyID());
                                player.useKey(galleryItm.getKeyID()); //Removing both keys
                                ui.displayPrompt("You put both halves of your key together to form the MASTER BEDROOM KEY!");
                                player.addItem(masterItm);
                                return;
                            }
                        }
                    }
                }
                else
                {
                    ui.displayPrompt("You walk away.");
                }
            }
            else {
                ui.displayPrompt("This item seems dormant.");
            }
        }

         else if (mPuzzle.getDescription() == "Mirror Puzzle") //if in mirror puzzle execute mirror puzzle
            {
                if (mPuzzle.isSolved() == false) //if puzzle solved
                {
                    mPuzzle.runPuzzle();
                    if (mPuzzle.isSolved())
                    {
                        ui.displayPrompt("You solved the Mirror Puzzle! You recieved a half of a key in your inventory.");
                        PickUpItemClass pickup(mirrorItm);
                        pickup.addToInventory(player);

                        std::vector <ItemClass>& inv = player.getInventory();
                        for (auto& item : inv)
                        {
                            if (item.getName() == "GALLERY HALF KEY")
                            {
                                player.useKey(item.getKeyID());
                                player.useKey(mirrorItm.getKeyID());
                                ui.displayPrompt("You put both halves of your key together to form the MASTER BEDROOM KEY!");
                                player.addItem(masterItm);
                                return;
                            }
                        }
                    }
                    else
                    {
                        ui.displayPrompt("You failed to solve the mirror puzzle");
                    }
                }
                else
                {
                    ui.displayPrompt("You already solved this puzzle.");
                }
                
            }

            else if (fPuzzle.getDescription() == "Fountain Puzzle") //if in fountain puzzle execute fountain puzzle
            {
                if (fPuzzle.isSolved() == false)
                {
                    fPuzzle.runPuzzle(); //Run the fountain puzzle
                    if (fPuzzle.isSolved()) //IF solved
                    {
                        ui.displayPrompt("You solved the Fountain Puzzle!");
                        player.addItem(fountainItem);
                    }
                }
                else
                {
                    ui.displayPrompt("This item seems dormant.");
                }
            }

            else if (maPuzzle.getDescription() == "Maze Puzzle") {//if in maze puzzle
                
                ui.displayPrompt("Are you ready to traverse the maze? (YES OR NO)");
                if (ui.userInput() == "YES")
                {
                    system("cls");
                    if (maPuzzle.isSolved() == false)
                    {
                        maPuzzle.runPuzzle(); //Run maze puzzle
                        if (maPuzzle.isSolved())
                        {
                            ui.displayPrompt("You solved the Maze Puzzle!");
                            ui.displayPrompt("You find a map of the maze at the end of this sequence of symbols. You pick it up to navigate the maze.");
                            player.addItem(mazeItem);
                        }
                        else
                        {
                            ui.displayPrompt("You failed the Maze Puzzle.");
                        }
                    }
                    else
                    {
                        ui.displayPrompt("This item seems dormant.");
                    }
                }
                else
                {
                    system("cls");
                }
            }
            else if (memPuzzle.getDescription() == "Memory Puzzle") {

                if (memPuzzle.isSolved() == false)
                {
                    memPuzzle.runPuzzle();

                    if (memPuzzle.isSolved()) {
                        ui.displayPrompt("The memories react positively to your answers, they break free from the crystal tank and attack your body, ripping out a memory of your own, they place it in your hand and go back into the tank");
                        player.addItem(memoryItem); 
                    }
                    else {
                        ui.displayPrompt("");
                    }
                }
                else
                {
                    ui.displayPrompt("This item seems dormant.");
                }
            }
            else if (chaPuzzle.getDescription() == "Chant Puzzle") {

                if (chaPuzzle.isSolved() == false) {
                    chaPuzzle.runPuzzle(); 

                    if (chaPuzzle.isSolved()) {
                        ui.displayPrompt("The monster roars as you chant, you get teleported back to the ritual room with the 5th candle in your hand");
                        ui.displayPrompt("WORK IN PROGRESS: Functionality to teleport back to the RITUAL ROOM");
                        player.addItem(chantItem);
                        
                    }
                    else {
                        ui.displayPrompt("");
                    }
                }
            }
    }
        
    else {
        ui.displayPrompt(inputMessage);
        ui.displayPrompt("Enter INTERACT: ");
        ui.userInput();

        if (ui.getCurrentInput() == "INTERACT")
        {
            //output interaction message
            ui.displayPrompt(interactMessage);
            
        }
        else {
            ui.displayPrompt("You walk away.");
         
        }
    }

}
//function to display object description
void InteractClass::displayDescription() {
    ui.displayPrompt(interactMessage); // uses userinterface class to display description 
}
//Function to Pickup an item
void InteractClass::pickupItem(const PickUpItemClass& item) {
    std::cout << "" << std::endl;
}
//function to use UserInterfaceClass
void InteractClass::useUserInterface() {
    //
}
