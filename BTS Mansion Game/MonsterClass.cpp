#include "MonsterClass.h"
#include <cstdlib>
#include <windows.h>
#include <mmsystem.h>
#include <iostream>
#include <conio.h>
#include <iostream>

#pragma comment(lib, "winmm.lib")

MonsterClass::MonsterClass()
{
	duration = 60;
	timerTriggered = false;
	stopFlag = false;
}

MonsterClass::MonsterClass(int dur, GameControllerClass& myController, PlayerClass& currPlayer)
{
	duration = dur;
	timerTriggered = false;
	stopFlag = false;
	currentGameController = &myController;
	timeRemaining = dur; 
	currentPlayer = &currPlayer;
}

void MonsterClass::onTimerTriggered() //Runs when timer finishes

{
	system("cls");

	if (currentGameController && currentGameController->inProtectedState()) {
		// If the player is in a protected state, skip the grab action
		return;
	}
	grabFlag = true; //Setting grabFlag to true
	

	//Play sound and display ascii art when grabbed

	UserInterfaceClass ui;
	ui.displayPrompt("A shadowy monster with elongated limbs grabs you, as the shadows encapsulating this monster consume you and all you can feel is its cold embrace.");
	PlaySound(TEXT("jumpscare.wav"), NULL, SND_FILENAME | SND_ASYNC);
	std::cout << (R"(
       ___,---.__          /'|`\          __,---,___
    ,-'    \`    `-.____,-'  |  `-.____,-'    //    `-.
  ,'        |           ~'\     /`~           |        `.
 /      ___//              `. ,'          ,  , \___      \
|    ,-'   `-.__   _         |        ,    __,-'   `-.    |
|   /          /\_  `   .    |    ,      _/\          \   |
\  |           \ \`-.___ \   |   / ___,-'/ /           |  /
 \  \           | `._   `\\  |  //'   _,' |           /  /
  `-.\         /'  _ `---'' , . ``---' _  `\         /,-'
     ``       /     \    ,='/ \`=.    /     \       ''
             |__   /|\_,--.,-.--,--._/|\   __|
             /  `./  \\`\ |  |  | /,//' \,'  \
           /   /     ||--+--|--+-/-|     \   \
           |   |     /'\_\_\ | /_/_/`\     |   |
            \   \__, \_     `~'     _/ .__/   /
             `-._,-'   `-._______,-'   `-._,-'
		)");


	ui.displayPrompt("The longer you stare, the more you feel you lose your ties to reality, as if it was sucking the life out of you");


	//for some reason, the code works fine when pressing enter, so i simulated an enter press, and then everything works as intended.
	keybd_event(VK_RETURN, 0x1C, 0, 0);
	keybd_event(VK_RETURN, 0x1C, KEYEVENTF_KEYUP, 0); 

	std::this_thread::sleep_for(std::chrono::milliseconds(5000)); //pause while user reads
	
	ui.displayPrompt("Its been satisfied -- It disappears into nothingness, you have lost 30 sanity. and fall to the ground");
	std::this_thread::sleep_for(std::chrono::milliseconds(5000)); //pause
	currentPlayer->setSanity(currentPlayer->getSanity() - 30); //when user is grabbed, user loses 30 sanity
	system("cls"); 

	//clears buffer if the user spammed characters while frozen
	while (_kbhit()) {
		_getch(); 
	}

	if (currentPlayer->getSanity() <= 0) {
		ui.displayPrompt("The monster sucked the remaining life out of your body");//death message
		ui.displayPrompt("You are unable to wake up");


		std::this_thread::sleep_for(std::chrono::milliseconds(10000)); //add a delay
		currentGameController->endGame(); // end the game

	}
	else {
		ui.displayPrompt("Press ENTER to wake up");
		char key;
		do {
			key = _getch();
		} while (key != '\r'); // Only exit if Enter is pressed
		system("cls");
	}
}

void MonsterClass::start()
{

	UserInterfaceClass myUI;
	stop(); //Stop any previous threads
	stopFlag = false; //Reset stop flag
	timerTriggered = false; //reset trigger status
	timeRemaining = duration; // setting the time remaining to the total expected duration, initaliing it

	timerThread = std::thread([this]() { //Creates thread that when it hits the end of timer, to run the onTimerTriggered member function

		while (timeRemaining > 0 && !stopFlag) {

			if (currentGameController && currentGameController->inProtectedState()) //stops the timer if in protected
			{
				std::this_thread::sleep_for(std::chrono::seconds(1));
				continue; //continue prevents the time from going down, and freezes it
			};


			std::this_thread::sleep_for(std::chrono::seconds(1));
			timeRemaining--; //lower the time left, keeps track while in protected state

			if (timeRemaining == 15 && !stopFlag) {
				std::cout << "The monster is approching, you must hide, hurry!" << endl; //if timer has less than 2 seconds, the user is notified to hide
			}
		}

		if (timeRemaining == 0 && !stopFlag) {
			timerTriggered = true;
			onTimerTriggered(); //trigger if time is up
		}
	});
}

void MonsterClass::stop()
{

	stopFlag = true;
	timeRemaining = duration; //when timer is reset, the duration is set equal to the time that was left
	if (timerThread.joinable())
	{
		timerThread.join();
	}
}

void MonsterClass::reset()
{
	start();
}

bool MonsterClass::isTriggered() const
{
	return timerTriggered;
}

bool MonsterClass::isGameOver() const
{
	return gameOverFlag;
}

void MonsterClass::setIsGameOver(bool state)
{
	gameOverFlag = state;
}

bool MonsterClass::isGrab() const
{
	return grabFlag;
}

void MonsterClass::join()
{
	if (timerThread.joinable())
	{
		timerThread.join();
	}
}
MonsterClass::~MonsterClass()
{
	stop();
}