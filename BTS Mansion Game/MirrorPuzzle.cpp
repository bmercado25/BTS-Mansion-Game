#include "MirrorPuzzle.h"

MirrorPuzzle::MirrorPuzzle()
{
	_description = " ";
	_isSolved = false;
}

MirrorPuzzle::MirrorPuzzle(std::vector <std::string> correctAns)
{
	_description = "Mirror Puzzle";
	_isSolved = false;
	correctAnswers = correctAns;
	_hint = "Default hint.";
}

MirrorPuzzle::MirrorPuzzle(std::vector<std::string> correctAns, std::string hint)
{
	_description = "Mirror Puzzle";
	_isSolved = false;
	correctAnswers = correctAns;
	_hint = hint;
}

void MirrorPuzzle::runPuzzle()
{
	UserInterfaceClass ui;
	bool giveHint = false;
	for (int i = 0; i < 3; i++) //Needs 3 differences, so 3 iterations
	{
		ui.displayPrompt("Enter word: ");
		std::string input = ui.userInput();
		answers.push_back(input);
		if (input == "HINT")
		{
			ui.displayPrompt("\nHINT: " + _hint + "\n");
		}
	}

	if (answers == correctAnswers)
	{
		system("cls");
		_isSolved = true;
	}
	else {
		system("cls");
	}

	
	for (int i = 0; i < 3; i++)
	{
		answers.pop_back(); //Resetting vector
	}
}