#include "FountainPuzzle.h"

FountainPuzzle::FountainPuzzle()	//Default constructor
{
	_description = " ";
	_isSolved = false;
	answer1 = " ";
	answer2 = " ";
	answer3 = " ";
	answer4 = " ";
}

FountainPuzzle::FountainPuzzle(std::string ans1, std::string ans2, std::string ans3, std::string ans4, std::vector<std::string> hintList)
{
	_description = "Fountain Puzzle";
	_isSolved = false;
	answer1 = ans1;
	answer2 = ans2;
	answer3 = ans3;
	answer4 = ans4;
	_hintList = hintList; 
}

void FountainPuzzle::runPuzzle() //Runs puzzle
{
	int correctAnswerCount = 0; //Tracking amount of correct answers
	int answerCount = 0; //Tracking amount of guesses
	UserInterfaceClass ui; //Creating ui for i/o
	std::string input; //Input from user


	while (answerCount < 5 && _isSolved == false) //Goes until five tries or until puzzle solved
	{
		if (correctAnswerCount == 0) //First riddle
		{
			ui.displayPrompt("I can't be touched, yet I can be felt. When I arrive you may yell. Run or fight its your right. What am I?");
			input = ui.userInput();
			if (input == answer1) //Correct answer
			{
				ui.displayPrompt("The fountain panel lights up with a soft blue light, you answered correctly!");
				correctAnswerCount++;
			}
			else if (input == "HINT")
			{
				ui.displayPrompt(_hintList.at(correctAnswerCount));
			}
			else //Wrong answer
			{
				ui.displayPrompt("The fountain panel doesn't respond to your attempt, try again.");
				answerCount++;
			}
		}

		else if (correctAnswerCount == 1) //Second riddle
		{
			ui.displayPrompt("I linger in shadows, in the dark I dance. I tell tales of old, leaving my mark. What am I?");
			input = ui.userInput();
			if (input == answer2) //Correct answer
			{
				ui.displayPrompt("The fountain panel lights up with a soft blue light, you answered correctly!");
				correctAnswerCount++;
			}
			else if (input == "HINT")
			{
				ui.displayPrompt(_hintList.at(correctAnswerCount));
				answerCount--;//This line is here because we don't want the hint request counting towards the number of attempts at answering
			}
			else //Wrong answer
			{
				ui.displayPrompt("The fountain panel doesn't respond to your attempt, try again.");
				answerCount++;
			}
		}

		else if (correctAnswerCount == 2) //Third riddle
		{
			ui.displayPrompt("I have a face, devoid of eyes. I have hands but no arms. What am I?");
			input = ui.userInput();
			if (input == answer3) //Correct answer
			{
				ui.displayPrompt("The fountain panel lights up with a soft blue light, you answered correctly!");
				correctAnswerCount++;
			}
			else if (input == "HINT")
			{
				ui.displayPrompt(_hintList.at(correctAnswerCount));
			}
			else //Wrong answer
			{
				ui.displayPrompt("The fountain panel doesn't respond to your attempt, try again.");
				answerCount++;
			}
		}

		else if (correctAnswerCount == 3) //Fourth riddle
		{
			ui.displayPrompt("I guard the resting, in silence I stand. With stones as my sentinels, marking this land. My duty is solemn, my vigil is long. What am I?");
			input = ui.userInput();
			if (input == answer4) //Correct answer
			{
				ui.displayPrompt("The fountain panel lights up with a soft blue light, you answered correctly!");
				correctAnswerCount++;
			}
			else if (input == "HINT")
			{
				ui.displayPrompt(_hintList.at(correctAnswerCount));
			}
			else //Wrong answer
			{
				ui.displayPrompt("The fountain panel doesn't respond to your attempt, try again.");
				answerCount++;
			}
		}
		else if (correctAnswerCount == 4) //Solved puzzle
		{
			system("cls");
			ui.displayPrompt("All of the panels glow brightly together, as a small flask glows at the bottom of the fountain. You quickly reach into the water and grab the flask as the lights go dim once more.");
			_isSolved = true;
		}
	}

	if (correctAnswerCount != 4) //Failed puzzle
	{
		system("cls");
		ui.displayPrompt("All of the panels glow a soft red, it seems you have angered something with your lackluster attempts. Hopefully that didn't alert anything.");
		_isSolved = false;
	}

}