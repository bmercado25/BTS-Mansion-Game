

#pragma once
#ifndef GAMECONTROLLER_H
#define GAMECONTROLLER_H

#include <string>
#include "UserInterfaceClass.h"
#include "PlayerClass.h"
#include <unordered_map>
#include <list>

class GameControllerClass
{
	//Game controller class is responsible for driving the game, it will contain functions to start and end the game and utilizes the UserInterfaceClass to process inputs etc.

	private: 
	UserInterfaceClass UI;
	std::string backstory;
	std::string goodEnding;
	std::string badEnding;
	std::string neutralEnding;
	bool isInProtectedAction = false; 

public:
	GameControllerClass(); 
	//constructor
	void startGame();
	//mbr function to start the game for user
	void showMenu();
	//mber function to show menu to user via UI object
	void gameLoop();
	//mber function which is responsible for driving the game; it is the main game loop where the users actions will be parsed and output will be displayed via UI object
	void displayBackstory();
	//function to display backstory to user
	void endGame();
	//default mber function which will exit game loop if chosen
	void pickUpNoteSequence(PlayerClass& myPlayer); 
	//function that displays option to pick up note in room A
	void displayInventory();
	// shows inventory
	void viewInventory(PlayerClass& myPlayer);
	//prompts to view inventory
	//Function that displays option to interact ,read or exit the statue.
	void handleDoors(PlayerClass& player, RoomClass& currentRoom, const std::string& targetRoom, const std::list<std::string>& newRoomOptions, std::unordered_map<std::string, RoomClass>& rooms, const std::string& openMessage, std::string command);
	void updateSanityGrabbed(PlayerClass& player);
	void sanitySequence(PlayerClass& userPlayer, std::atomic<bool>& running); // function that handles sanity output
	void updateSanity(PlayerClass& player, int amount); //Function that changes player sanity by passing an integer to add to the value
	void playTeleportSequence(); // function that plays the text sequence
	void endingSequence(UserInterfaceClass UI); //the ending sequence of the game

	void endGame(std::string flavorText); // overloaded endGame function that takes string instead of default text
	bool inProtectedState(); 
};

#endif