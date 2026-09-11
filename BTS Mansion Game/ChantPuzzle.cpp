#include "ChantPuzzle.h"

ChantPuzzle::ChantPuzzle() {
	_description = " ";
	_isSolved = false;
}

ChantPuzzle::ChantPuzzle(std::string puzzleName) {
	_description = puzzleName;
	_isSolved = false;
}

void ChantPuzzle::runPuzzle() {


	UserInterfaceClass ui; //declaring for user input
	std::string input; //storing input 

	ui.displayPrompt("Speak your chant:"); 

	input = ui.userInput();

	if (input == "EXTINGUE FLAMMAM PECCATORUM TUORUM") { //checking if user inputs right text
		_isSolved = true; //boolean is flipped to true and candle is awarded to the player
	}
	else if (input == "HINT")
	{
		ui.displayPrompt("A bunch of rooms floating in the void? A tank that stores memories? A goblet? This altar? What is it all for?\nPerhaps if you could see with more than just your eyes, this would all be much clearer.");
	}
	else {
		system("cls");
		ui.displayPrompt("Nothing happens... "); //if the input if wrong
	}

}