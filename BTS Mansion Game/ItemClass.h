#pragma once
#ifndef ITEMCLASS_H
#define ITEMCLASS_H

#include <string>
#include <chrono>
//#include "InteractClass.h"


class InteractClass; 

class ItemClass
{
	//Only write declarations here, actual code will be in cpp file.
private:
	std::string name; //Stores item name
	std::string description; //Stores description of the item
	std::string keyID; //Stores ID of key items
	int value; //Value of any consumable (sanity pills heal amount)
	bool isConsumable; //Tracks whether item can be consumed or not
	bool canPickUp; //Tracks whether item can be picked up or not
	InteractClass* interaction = nullptr;
	std::string soundFileName = ""; 

	bool canExpire; //if the item dissapears after a certain amount of time
	std::chrono::steady_clock::time_point timeTillExpiration; // expiration timer

public:
	ItemClass(); //Constructors
	ItemClass(std::string n, std::string desc); //Constructor for an unknownItem (dev use)
	ItemClass(std::string n, std::string desc, bool pickUp, std::string fileName); //Constructor for a note
	ItemClass(std::string n, std::string desc, std::string id, bool consumable, bool canPickUp); //Constructor for a key
	ItemClass(std::string n, std::string desc, int val, bool consumable, bool canPickUp); //Constructor for a consumable
	ItemClass(std::string n, std::string desc, bool pickUp, InteractClass* interact); //Constructor for an interactable item
	explicit ItemClass(std::string n, std::string desc, bool pickUp, bool expire); //for expiring item

	ItemClass(std::string n, std::string desc, std::string id, bool consumable, bool canPickUp,std::string fileName); //Constructor for a key with sound	ItemClass(std::string n, std::string desc, bool pickUp, std::string fileName); 		//Constructor for a note with sound

	std::string getName(); //Return item name
	void setName(std::string newName); //Sets item to a new name

	std::string getDescription(); //Return item description
	void setDescription(std::string newDescription); //Sets item description

	std::string getKeyID(); //Returns key ID
	void setKeyID(std::string id); //Sets key ID

	int getValue(); //Returns item value
	void setValue(int val); //Sets value of item
	
	bool getIsConsumable(); //Returns true/false if consumable or not
	void setIsConsumable(bool consumable); //Sets isConsumable to T/F

	bool getCanPickUp(); //Returns true/false if pick up able or not
	void setCanPickUp(bool pickUp); //Sets canPickUp to T/F

	void displayItem(); //Displays item and description

	InteractClass* getInteraction(); //Returns interaction
	void setInteraction(InteractClass* interact); //Sets interaction

	void playItemSound(); // function for sound file


	std::string getSoundFileName();
};

#endif