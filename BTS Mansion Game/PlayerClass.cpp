#include "PlayerClass.h"

PlayerClass::PlayerClass()
{
	numCandles = 0;
	sanityMeter = 100;
}

PlayerClass::PlayerClass(RoomClass &room)
{
	numCandles = 0;
	sanityMeter = 100;
	currentRoom = &room; //Setting default values
}

int PlayerClass::getCandles()
{
	return numCandles; //Returning number of candles
}

void PlayerClass::addCandle()
{
	numCandles += 1; //Adding 1 to num of candles
}

int PlayerClass::getSanity()
{
	return sanityMeter; //Getting sanity meter
}

void PlayerClass::addItem(ItemClass item)
{
	Inventory.push_back(item); //adds item to inventory, test description
}

void PlayerClass::setSanity(int sanityValue)
{
	sanityMeter = sanityValue; //Setting sanity meter
}

RoomClass& PlayerClass::getRoom()
{
	return *currentRoom; //Returns current room
}

std::string PlayerClass::getRoomName()
{
	return currentRoom->GetName();
}

std::string PlayerClass::getRoomDescription()
{
	return currentRoom->GetDescription();
}

void PlayerClass::setRoom(RoomClass &room)
{
	currentRoom = &room; //Sets current room
}

std::vector<ItemClass>& PlayerClass::getInventory() //Returns reference to inventory for direct modification and use (Like using a key or sanity pill)
{
	return Inventory; //Returns direct reference to inventory for modification and use (adding to inventory, key, etc)
}

std::vector<ItemClass> PlayerClass::viewInventory() const
{
	return Inventory; //Returns non modifiable copy of inventory for display
}

int PlayerClass::getInventorySize() const
{
	return Inventory.size(); //Returns size of inventory
}

/*The method overload that passes in an ItemClass should maybe be phased out, since the easiest way to use an item is
* to pass in the name of the item we want as a string rather than using an entire item object.
* The useItem method is called when the player tries to use an item
*/
void PlayerClass::useItem(ItemClass item)//This overload of useItem simply gets the name string from the passed in item, then passes that to the overload of useItem that takes a string as input.
{
	useItem(item.getName());
}

void PlayerClass::useItem(std::string itemName)//Method for using and removing (if applicable) an item from the player's inventory, taking the name of the item as input
{
	/*
	* We step through the list of items in Inventory one item at a time and check to see if they match the name passed into the method.
	*/
	for (int i = 0; i < Inventory.size(); i++)
	{
		if (Inventory.at(i).getName() == itemName)
		{
			//If we want to include any item use logic within the ItemClass object itself, that should get called here.

			if (Inventory.at(i).getIsConsumable())//If the item has the property isConsumable, we delete it from the inventory.
			{
				Inventory.erase(Inventory.begin() + i);
			}   
			return; //If we've found an appropriate item, we exit the method. If the player has three consumable items called "MATCH" for instance, we only want to use one and not all three
		}
	}
	return;
}

void PlayerClass::useKey(std::string id)
{
	/*
	* We step through the list of items in Inventory one item at a time and check to see if they match the name passed into the method.
	*/
	for (int i = 0; i < Inventory.size(); i++)
	{
		if (Inventory.at(i).getKeyID() == id)
		{
			//If we want to include any item use logic within the ItemClass object itself, that should get called here.

			if (Inventory.at(i).getIsConsumable())//If the item has the property isConsumable, we delete it from the inventory.
			{
				Inventory.erase(Inventory.begin() + i);
			}
			return; //If we've found an appropriate item, we exit the method. If the player has three consumable items called "MATCH" for instance, we only want to use one and not all three
		}
	}
	return;
}

ItemClass PlayerClass::getItem(std::string n)
{ //Searches through array for specified item n, if not found returns a default unknownItem so devs can know verify through if statements if a valid item was found
	ItemClass unknownItem("Unknown", "Item not found");
	for (int i = 0; i < Inventory.size(); i++)
	{
		if (Inventory[i].getName() == n)
		{
			return Inventory[i]; //Returns copy of item for displaying in UI class
		}
		else
		{
			return unknownItem; //Returns unknown item to show item not found
		}
	}
}

bool PlayerClass::inInventory(std::string name) const
{
	for (auto item : Inventory) {
		if (item.getName() == name) {
			return true; // Item found in inventory
		}
	}
	return false; // No match found
}

std::string PlayerClass::searchForKey(std::string id)
{
	for (auto item : Inventory) {
		if (item.getKeyID() == id) {
			return item.getKeyID();
		}
	}

	return "No key in your inventory.";
}

bool PlayerClass::searchForCandle()
{
	for (auto item : Inventory) {
		if (item.getName() == "CANDLE") {
			return true;
		}
	}
}

bool PlayerClass::inInventory(std::string name, std::string id) const
{
	for (auto item : Inventory) {
		if (item.getName() == name && item.getKeyID() == id) {
			return true; // Item found in inventory
		}
	}
	return false; // No match found
}

void PlayerClass::useItem(std::string itemName,std:: string id )//Method for using and removing (if applicable) an item from the player's inventory, taking the name of the item as input
{
	/*
	* We step through the list of items in Inventory one item at a time and check to see if they match the name passed into the method.
	*/
	for (int i = 0; i < Inventory.size(); i++)
	{
		if (Inventory.at(i).getName() == itemName && Inventory.at(i).getKeyID() == id)
		{
			//If we want to include any item use logic within the ItemClass object itself, that should get called here.
			if (Inventory.at(i).getIsConsumable())//If the item has the property isConsumable, we delete it from the inventory.
			{
				Inventory.erase(Inventory.begin() + i);
			}
			return; //If we've found an appropriate item, we exit the method. If the player has three consumable items called "MATCH" for instance, we only want to use one and not all three
		}
	}
	return;
}

void PlayerClass::removeItem(std::string n)
{
//for joey: add functionality to remove the item
}
