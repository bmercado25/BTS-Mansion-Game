#include "MemoryPuzzle.h"

MemoryPuzzle::MemoryPuzzle() {
	_description = " ";
	_isSolved = false;
	_hint = "Trust in your memory.";
}

MemoryPuzzle::MemoryPuzzle(std::string puzzleName) {
	_description = puzzleName;
	_isSolved = false;
	_hint = "Trust in your memory.";
}




void MemoryPuzzle::runPuzzle() {

	UserInterfaceClass ui; //Creating ui for i/o
	std::string input; //Input from user

	const int STARTING_LENGTH = 2; //starting size for string of letters
	const int FINAL_LENGTH = 5; //ending size for string of letters
	bool toContinue = true; //boolean that will listen to the display letter function and see if it returns true or false

	ui.displayPrompt("You place your hand on the tank, they are testing your memory, you must recite the memories that they tell you"); //starting text

	for (int i = STARTING_LENGTH; i <= FINAL_LENGTH && toContinue; i++) { //going through each length but also checking to make sure displayletters didnt return false
		std::string sequence = randomLetterString(i); //storing current string
		toContinue = displayLetters(sequence,ui); //passing in the current sequence and the ui to the display letters

	}

	if (toContinue) { //if the code makes it to this point, that means the user succeeded and the puzzle is solved
		system("cls");
		_isSolved = true; 
	}

}

std::string MemoryPuzzle::randomLetterString(int length)
{
	std::string sequence;
	srand(static_cast<unsigned>(time(0))); //seed
	for (int i = 0; i <= length; i++) {
		char letter = 'A' + rand() % 26; //using ascii values from random number and doing modulus of 26, for the 26 letters of the alphabet, we start at the letter A and add the numbers to increase it by 26
		sequence += letter; //adding new letter to sequence
	}

	return sequence; 
}

bool MemoryPuzzle::displayLetters(std::string& sequence, UserInterfaceClass ui) {
	std::string input;

	std::this_thread::sleep_for(std::chrono::milliseconds(800)); //delay before starting the game

	for (int i = 0; i < sequence.length(); i++) {
		std::this_thread::sleep_for(std::chrono::milliseconds(800)); //delay before displaying first letter
		std::cout << sequence[i] << " "; //display letter
		std::this_thread::sleep_for(std::chrono::milliseconds(800));//delay before displaying next
	}
	std::this_thread::sleep_for(std::chrono::milliseconds(3000));//delay before wiping console
	system("cls"); //wiping console to avoid cheating

	while (_kbhit()) {
		_getch();
	}

	ui.displayPrompt("Recite the memory");
	input = ui.userInput();
	if (input == sequence) {
		ui.displayPrompt("The memories react");  //user succeeded
	}
	else if (input == "HINT")
	{
		ui.displayPrompt(_hint);
		return false;
	}
	else {
		ui.displayPrompt("eeeeeeeThe memories stop reacting"); //user failed 
		return false;
	}



}