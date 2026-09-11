#pragma once
#ifndef PLAYERCLASS_H
#define PLAYERCLASS_H


#include "ItemClass.h"
#include "RoomClass.h"
#include <string>
#include <vector>

class PlayerClass
{
#ifndef debug

	//Only write declarations here, actual code will be in cpp file.
private:
	int numCandles; //Variable to keep track of number of candles collected
	int sanityMeter; //Variable to track the value of the sanity meter
	RoomClass* currentRoom; //Stores the current room the player is currently in
	std::vector<ItemClass> Inventory; //Vector Array of Item Class objects for inventory
	
	
public:
	PlayerClass();
	PlayerClass(RoomClass &room); //constuctor (set to default values)
	
	int getCandles(); //returns number of candles player has
	void addCandle(); //Adds ONE candle to the number of candles player has
	std::string getRoomName(); //returns string of name of users current room
	std::string getRoomDescription(); //returns string of current room description
	void addItem(ItemClass item); //gives user item in their inventory

	int getSanity(); //Returns sanity value of player
	void setSanity(int sanityValue); //Set the sanity value

	RoomClass& getRoom(); //Returns room player is in
	void setRoom(RoomClass &room); //Sets the room the player is in

	std::vector<ItemClass>& getInventory(); //Returns whole array of direct reference to inventory
	std::vector<ItemClass> viewInventory() const; //Returns a copy of inventory array for displaying in UI class
	int getInventorySize() const; //Returns size of inventory
	void useItem(ItemClass item); //Check if consumable, then if true, remove from inventory and display effect of item
	void useItem(std::string itemName); //Overload of useItem that takes the name of an item as a string rather than passing in an item object
	void useKey(std::string id); //Uses key items same functioanlity as above but for keys
	ItemClass getItem(std::string n); //Returns copy of specific item from inventory for inspection displayed by UI class
	void removeItem(std::string n); //removes item from inventory
	bool inInventory(std::string name) const;  //returns true or false of an items existence in inventory
	std::string searchForKey(std::string id); //Returns key id of key needed for a door from player inventory
	bool searchForCandle(); //returns whether candle is in user inventory
	bool inInventory(std::string name, std::string id) const;	//Get the id for the candle 
	void useItem(std::string itemName, std::string id);	//Use item with id for candle 

#endif
};
#endif