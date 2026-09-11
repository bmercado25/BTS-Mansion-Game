#include "ItemClass.h"
#include "InteractClass.h"
#include<iostream>
#include<string>
#include <windows.h>

using namespace std;

/*
Item class gives provides the name and description
of the item when player picks it up and shown when player
looks in their inventory.
*/

	ItemClass::ItemClass()
	{
		name = " ";
		description = " ";
		keyID = " ";
		isConsumable = false;
		value = 0;
		canPickUp = false;
		interaction = nullptr;
	}

	ItemClass::ItemClass(std::string n, std::string desc) //Constructor for unknownItem (Dev use)
	{
		name = n;
		description = desc;
		keyID = " ";
		isConsumable = false;
		value = 0;
		canPickUp = false;
		interaction = nullptr;
	}

	ItemClass::ItemClass(std::string n, std::string desc, bool pickUp, InteractClass* interact)         //Constructor for an interactable object
	{
		name = n;
		description = desc;
		keyID = " ";
		isConsumable = false;
		value = 0;
		canPickUp = pickUp;
		interaction = interact;
		soundFileName = "test";
	}

	ItemClass::ItemClass(std::string n, std::string desc, bool pickUp, std::string fileName) 		//Constructor for a note
	{
		name = n;
		description = desc;
		keyID = " ";
		isConsumable = false;
		value = 0;
		canPickUp = pickUp;
		interaction = nullptr;
		soundFileName = fileName;
	}


	ItemClass::ItemClass(string n, string desc, string id, bool consumable, bool pickUp) //Constructor for a key
	{
		name = n;
		description = desc;
		keyID = id;
		isConsumable = consumable;
		value = 0;
		canPickUp = pickUp;
		interaction = nullptr;

	}

	ItemClass::ItemClass(string n, string desc, int val, bool consumable, bool pickUp) //Constructor for a consumable
	{
		name = n;
		description = desc;
		value = val;
		isConsumable = consumable;
		keyID = " ";
		canPickUp = pickUp;
		interaction = nullptr;

	}
	ItemClass::ItemClass(string n, string desc, bool pickUp, bool expire) {
		name = n;
		description = desc;
		value = 0;
		isConsumable = false;
		keyID = " ";
		canPickUp = pickUp;
		interaction = nullptr;
		canExpire = expire;
	}

	ItemClass::ItemClass(string n, string desc, string id, bool consumable, bool pickUp, string fileName) //Constructor for a key with sound
	{
		name = n;
		description = desc;
		keyID = id;
		isConsumable = consumable;
		value = 0;
		canPickUp = pickUp;
		interaction = nullptr;
		soundFileName = fileName;
	}




	string ItemClass::getName()
	{
		return name; //Returns item name
	}

	void ItemClass::setName(string newName)
	{
		name = newName; //Sets item name
	}

	string ItemClass::getDescription()
	{
		return description; //Returns item description
	}

	void ItemClass::setDescription(string newDescription)
	{
		description = newDescription; //Sets item description
	}

	string ItemClass::getKeyID()
	{
		return keyID; //Returns key ID
	}

	void ItemClass::setKeyID(string id)
	{
		keyID = id; //Sets key ID
	}

	int ItemClass::getValue()
	{
		return value; //Returns value of item
	}

	void ItemClass::setValue(int val)
	{
		value = val; //Sets value of item
	}

	bool ItemClass::getIsConsumable()
	{
		return isConsumable; //Returns if an item is a consumable
	}

	void ItemClass::setIsConsumable(bool consumable)
	{
		isConsumable = consumable; //Sets if an item is a consumable
	}

	bool ItemClass::getCanPickUp()
	{
		return canPickUp; //Returns if an item can be picked up
	}

	void ItemClass::setCanPickUp(bool pickup)
	{
		canPickUp = pickup; //Sets if pick up is true or false
	}

	void ItemClass::displayItem()
	{
		cout << "Item: " << name << endl;
		cout << "Description: " << description << endl; //Displays item and description (for testing purposes, assuming UI class handles all input output)
	}

	InteractClass* ItemClass::getInteraction()
	{
		return interaction;
	}

	void ItemClass::setInteraction(InteractClass* interact)
	{
	 	interaction = interact;
	}

	void ItemClass::playItemSound() {
		// Convert std::string to std::wstring for Unicode compatibility
		std::wstring wideSoundFile(soundFileName.begin(), soundFileName.end());

		// Use the wide string in PlaySound
		PlaySound(wideSoundFile.c_str(), NULL, SND_FILENAME | SND_ASYNC);
	}

	std::string ItemClass::getSoundFileName() {
		
		//cout << "Getting sound file name" << endl;
		return soundFileName;

	}