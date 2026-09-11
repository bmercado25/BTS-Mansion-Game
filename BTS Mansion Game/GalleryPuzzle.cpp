#include "GalleryPuzzle.h"
#include "InteractClass.h"
#include "UserInterfaceClass.h"

GalleryPuzzle::GalleryPuzzle()
{
	_description = " ";
	_isSolved = false;
}

GalleryPuzzle::GalleryPuzzle(std::vector <ItemClass> ports, std::vector <ItemClass> answer, std::string hint)
{
	_description = "Gallery Puzzle";
	_isSolved = false;
	portraits = ports;
	answers = answer;
	_hint = hint;
}

void GalleryPuzzle::runPuzzle()
{
	system("cls"); //clearing screen
	
	UserInterfaceClass ui;
	std::vector <ItemClass> userPortraits;
	std::string input;
	int answerCount = 0;
	int correctAnswerCount = 0;

	while (answerCount != answers.size()) // Loop through number of answer portraits for now because of initial implementation
	{
		ui.displayPrompt("The blood in the altar still bubbles with anticipation of your next portrait selection.");
		ui.displayPrompt("\n");

		ui.displayPrompt("The portraits inside the room are: ");
		ui.displayPrompt("\n");

		for (auto portrait : portraits) //Displaying all portraits
		{
			ui.displayPrompt(portrait.getName());
		}

		ui.displayPrompt("\n");
		ui.displayPrompt("Choose which portrait to touch.");
		input = ui.userInput();

		for (auto portrait : portraits) //Looping to check if a valid portrait entered
		{
			if (portrait.getName() == input)
			{
				userPortraits.push_back(portrait); //Adding to user answer vector
				answerCount++; //Incrementing the amount of answers made
				//ui.displayPrompt(userPortraits[0].getName());

				if (answers.at(answerCount - 1).getName() == userPortraits.at(answerCount - 1).getName()) //Checking if portrait is correct order
				{
					correctAnswerCount++;
				}
			}
			
		}

		system("cls"); //Clearing console
		if (input == "HINT")
		{
			ui.displayPrompt(_hint + "\n");
		}

	}

	if (correctAnswerCount == answers.size()) //Puzzle solved
	{
		system("cls");
		ui.displayPrompt("The blood stops bubbling and calms, revealing half of a bloody dais. You recieved the gallery half key!");
		_isSolved = true;
	}
	else {
		system("cls");
		ui.displayPrompt("The blood continues bubbling, dissapointed in your order of selections; maybe you need to go back and look for more clues.\n");
	}
}