#pragma once
#ifndef USERINTERFACECLASS_H
#define USERINTERFACECLASS_H

#include <string>

class UserInterfaceClass
{
	/*User interface class is responsible for displaying messsages into the console and taking user input, it will also store elements such as the menu etc.*/
private:
	std::string current_input;
public:
	UserInterfaceClass();
	//Helper function for preventing cutoff
	std::string preventCutoff(const std::string text) const;
	//Constructor for user interface class
	void displayPrompt(const std::string& prompt) const; 
	//display prompt will display any stinrg "prompt" given to the function
	void displayMenu() const;
	/*displays menu for the start of the game, will be in format of:
	Title
	===Main Menu===
	START Game
	QUIT
	===============
	Words in all caps will be input options for this game, please enter an option:*/

	std::string userInput();
	// will parse commands from user

	void setCurrentInput(std::string& uInput);
	// sets current input to whatever was entered by ueser through userInput() function

	std::string getCurrentInput() const;
	// gets current input to whatever was entered by user through userInput() function

	bool isValidInput(const std::string[]) const;
	// will compare user input to valid options (passed through as array of strings) and will return boolean variable according to whether user input is present in array or not

	void waitForInput() const;
	// waits for user press enter to progress certain multilined dialogue

	void displayPentacle(int candleVal);
	// prints pentagram with appropriate candle placements for RITUAL ROOM

	void displayPrompt(const std::string& prompt, int sanityLevel) const;
	/*overloaded display function that has sanity functionality.
	To use line breaks and paragraph indents, pass in " NEWLINE " and " INDENT " respectively as part of the string
	*/

	//-------------BELOW ARE THE HELPER FUNCTION FOR displayPrompt(string, int) overloaded function-------------------
	bool is_all_uppercase(const std::string& word) const; 
	//helper function that cheks if word is uppercase, as we are will skip the uppercase words for playability

	std::string jumble_word(const std::string& word, int intensity) const;
	//helper function that jumbles the word

};

#endif

