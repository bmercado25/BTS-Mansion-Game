#pragma once
#ifndef InteractClass_H
#define InteractClass_H

#include<iostream>
#include<string>
#include <sstream>

#include "PickUpItemClass.h" //Include header for PickUpItemClass
#include "UserInterfaceClass.h" // Included header for UserInterFaceClass
#include "Puzzle.h"
#include "GreaterLibraryPuzzle.h"
#include "GalleryPuzzle.h"
#include "MirrorPuzzle.h"
#include "FountainPuzzle.h"
#include "MazePuzzle.h"
#include "MemoryPuzzle.h"
#include "ChantPuzzle.h"

class InteractClass
{
private:
	std::string inputMessage;
	std::string interactMessage;
	bool interacted;
	bool isPuzzle;
	GreaterLibraryPuzzle gPuzzle = GreaterLibraryPuzzle();
	GalleryPuzzle puzzle = GalleryPuzzle();
	MirrorPuzzle mPuzzle = MirrorPuzzle();
	FountainPuzzle fPuzzle = FountainPuzzle();
	MazePuzzle maPuzzle = MazePuzzle();
	UserInterfaceClass ui; // UserInterfaceClass for input and output
	MemoryPuzzle memPuzzle = MemoryPuzzle(); 
	ChantPuzzle chaPuzzle = ChantPuzzle(); //chant puzzle

public:
	//Constructor
	InteractClass();
	InteractClass(std::string inMssg, std::string intMssg); //Constructor taking input and interact message
	InteractClass(std::string inMssg, std::string intMssg, GreaterLibraryPuzzle puzz); //Constructor taking input and interact message and greater library puzzle
	InteractClass(std::string inMssg, std::string intMssg, GalleryPuzzle puzz); //Constructor taking input and interact message and gallery puzzle
	InteractClass(std::string inMssg, std::string intMssg, MirrorPuzzle puzz); //Constructor taking input and interact message and gallery puzzle
	InteractClass(std::string inMssg, std::string intMssg, FountainPuzzle puzz); //Constructor taking input and interact message and fountain puzzle
	InteractClass(std::string inMssg, std::string intMssg, MazePuzzle puzz); //Constructor taking input and interact message and maze puzzle
	InteractClass(std::string inMssg, std::string intMssg, MemoryPuzzle puzz); //Constructor taking input and interact message and memory puzzle
	InteractClass(std::string inMssg, std::string interactMssg, ChantPuzzle puzz); // constructor for chant puzzle 

	// Funtion to set input message 
	void setInputMessage(const std::string& message);
	// function to set output message 
	void setOutputMessage(const std::string& message);
	//Function to return if a puzzle is in interaction or not
	bool getIsPuzzle();
	//function to interact with object or statue
	void runInteraction();
	void runInteraction(PlayerClass& player, ItemClass& greaterLibraryItem, ItemClass& galleryItm, ItemClass& mirrorItm, ItemClass& masterItm, ItemClass& fountainItem, ItemClass& mazeItem, ItemClass& memItem, ItemClass& chantItem);
	// function to display object description
	void displayDescription();
	// function to pick up an item
	void pickupItem(const PickUpItemClass& item);
	// function to use UserInterfaceClass
	void useUserInterface();
	// funtion to handle the interaction with statue
	void interactWithStatue();

	//Only write declarations here, actual code will be in cpp file.

};
#endif 
