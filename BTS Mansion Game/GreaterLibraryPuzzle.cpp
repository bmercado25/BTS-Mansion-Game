#include "GreaterLibraryPuzzle.h"

GreaterLibraryPuzzle::GreaterLibraryPuzzle()
{
	_description = " ";
	_isSolved = false;
	answer = { " " };
}

GreaterLibraryPuzzle::GreaterLibraryPuzzle(std::string solution)
{
	GreaterLibraryPuzzle(solution, "Default hint.");
}

GreaterLibraryPuzzle::GreaterLibraryPuzzle(std::string solution, std::string hint)
{
	_description = "Greater Library Puzzle";
	_isSolved = false;
	answer = solution;
	_hint = hint;
}


void GreaterLibraryPuzzle::runPuzzle()
{
	UserInterfaceClass ui; //To handle i/o
	std::string input; //input from user

	ui.displayPrompt("Enter the combination: ");
	input = ui.userInput();

	if (input == answer)
	{
		system("cls");
		ui.displayPrompt("You input the correct word, finding a key inside which you grab before seeing a poison dart ready to fire at you which you narrowly dodge. You obtained the STUDY KEY!");
		_isSolved = true; //Puzzle is solved
	}
	else if (input == "HINT")
	{
		ui.displayPrompt(_hint);
	}
	else
	{
		system("cls");
		ui.displayPrompt("That word doesn't seem to unlock the lock.");
		//Puzzle is not solved
	}
}