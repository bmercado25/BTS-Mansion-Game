import { Item } from "./item";
import type { Player } from "./player";

/**
 * Light port of C++ PickUpItemClass — moves an item onto the player.
 */
export class PickUpItem {
  private itemToBePickedUp: Item;

  constructor(item: Item = new Item()) {
    this.itemToBePickedUp = item;
  }

  getItemToBePickedUp(): Item {
    return this.itemToBePickedUp;
  }

  setItemToBePickedUp(item: Item): void {
    this.itemToBePickedUp = item;
  }

  addToInventory(player: Player): void {
    player.addItem(this.itemToBePickedUp);
  }
}
