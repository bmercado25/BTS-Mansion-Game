#include "MazePuzzle.h"

MazePuzzle::MazePuzzle()
{
	_description = " ";
	_isSolved = false;
	symbolKey = { " " };
	_hint = "That lantern... it seemed important.";
}

MazePuzzle::MazePuzzle(std::vector<std::string> key, std::vector<std::string> inc)
{
	_description = "Maze Puzzle";
	symbolKey = key;
	incorrectSymbols = inc;
	_hint = "That lantern... it seemed important.";
}

int MazePuzzle::GenerateRandomNumber(int min, int max)
{
	std::random_device rd;  // Seed for the random number engine
	std::mt19937 gen(rd()); // Mersenne Twister engine seeded with rd()
	std::uniform_int_distribution<> dis(min, max);
	return dis(gen); // Generates a random number in the range [min, max]
}

void MazePuzzle::runPuzzle()
{
	UserInterfaceClass ui; //ui for i/o	
	int ROUNDS = 10; //Amount of rounds until out of maze
	int min = 0;
	int incMax = incorrectSymbols.size() - 1;
	int corrMax = symbolKey.size() - 1;
	int index = 0; //Used for indexing
	int correctIndex = 0; //Used to put correct answer into options at random spots
	bool failPuzzle = false;

	ui.displayPrompt("You see multiple animals on the wall, maybe these can help you find your way.");
	for (int i = 0; i < symbolKey.size(); i++)
	{
		ui.displayPrompt(symbolKey.at(i)); //Display correct answers
	}

	ui.displayPrompt("Press ENTER when you've studied the animals long enough...");
	std::string test = ui.userInput();
	system("cls");

	for (int i = 0; i < ROUNDS; i++) //Loop that runs for number of rounds designated by ROUNDS variable
	{
		if (failPuzzle == false)
		{
			ui.displayPrompt("You see a set of animals all next to different paths, which will you take?\n");
			std::string correctAnswer; //Correct answer for round
			std::string incAnswer; //Inc answer for handling duplicates
			std::string userAnswer; //User answer for round
			std::vector<std::string> incAns; //List of incorrect answers for round (to track duplicates)
			int count = 0;
			int tempIndex = GenerateRandomNumber(0, 3); //Correct index for round

			for (int i = 0; i < 4; i++) //Loop setting up options for round
			{
				if (i == tempIndex)
				{
					correctAnswer = symbolKey.at(GenerateRandomNumber(0, corrMax));
					ui.displayPrompt(correctAnswer); //Displaying a correct symbol
				}
				else
				{
					if (count == 0)
					{
						incAnswer = incorrectSymbols.at(GenerateRandomNumber(0, incMax));
						ui.displayPrompt(incAnswer); //Displaying an incorrect symbol
						incAns.push_back(incAnswer); //Push to list of inc answers for round
					}
					else
					{
						incAnswer = incorrectSymbols.at(GenerateRandomNumber(0, incMax));

						for (int i = 0; i < incAns.size(); i++)
						{
							if (incAnswer == incAns.at(i)) //Means duplicate
							{
								while (incAnswer == incAns.at(i))
								{
									incAnswer = incorrectSymbols.at(GenerateRandomNumber(0, incMax));
								}
							}
						}

						incAns.push_back(incAnswer); //Push to list inc answers for round

						ui.displayPrompt(incAnswer); //Displaying an incorrect symbol
					}
				}
				count++; //iNCREMENT COUNT
			}

			userAnswer = ui.userInput();
			if (userAnswer == "HINT")
			{
				ui.displayPrompt(_hint);
			}
			if (userAnswer != correctAnswer) //Check if puzzle was failed
			{
				failPuzzle = true;
			}
			else
			{
				system("cls");
			}
		}
	}

	if (failPuzzle == false)
	{
		_isSolved = true;
		ui.displayPrompt("You found your way to the exit!");
	}
	else
	{
		ui.displayPrompt("You seem to have lost your way, and ended up back at the beginning of the maze.");
	}

}