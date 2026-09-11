import { Item } from "./item";
import { Room } from "./room";

/**
 * Browser port of C++ PlayerClass.
 */
export class Player {
  private numCandles = 0;
  private sanityMeter = 100;
  private currentRoom: Room | null = null;
  private inventory: Item[] = [];

  constructor(room?: Room) {
    if (room) {
      this.currentRoom = room;
    }
  }

  getCandles(): number {
    return this.numCandles;
  }

  addCandle(): void {
    this.numCandles += 1;
  }

  getSanity(): number {
    return this.sanityMeter;
  }

  setSanity(sanityValue: number): void {
    this.sanityMeter = sanityValue;
  }

  getRoom(): Room {
    if (!this.currentRoom) {
      throw new Error("Player has no current room.");
    }
    return this.currentRoom;
  }

  hasRoom(): boolean {
    return this.currentRoom !== null;
  }

  getRoomName(): string {
    return this.currentRoom?.getName() ?? "";
  }

  getRoomDescription(): string {
    return this.currentRoom?.getDescription() ?? "";
  }

  setRoom(room: Room): void {
    this.currentRoom = room;
  }

  getInventory(): Item[] {
    return this.inventory;
  }

  viewInventory(): Item[] {
    return [...this.inventory];
  }

  getInventorySize(): number {
    return this.inventory.length;
  }

  listInventoryNames(): string[] {
    return this.inventory.map((item) => item.getName());
  }

  addItem(item: Item): void {
    this.inventory.push(item);
  }

  removeItem(name: string): boolean {
    const index = this.inventory.findIndex((item) => item.getName() === name);
    if (index < 0) {
      return false;
    }
    this.inventory.splice(index, 1);
    return true;
  }

  getItem(name: string): Item {
    const found = this.inventory.find((item) => item.getName() === name);
    return found ? found : Item.unknown();
  }

  inInventory(name: string, id?: string): boolean {
    if (id === undefined) {
      return this.inventory.some((item) => item.getName() === name);
    }
    return this.inventory.some(
      (item) => item.getName() === name && item.getKeyID() === id,
    );
  }

  searchForKey(id: string): string {
    const found = this.inventory.find((item) => item.getKeyID() === id);
    return found ? found.getKeyID() : "no key in inventory";
  }

  searchForCandle(): boolean {
    return this.inventory.some((item) => item.getName() === "CANDLE");
  }

  useItem(itemOrName: Item | string): void {
    const itemName = typeof itemOrName === "string" ? itemOrName : itemOrName.getName();
    const index = this.inventory.findIndex((item) => item.getName() === itemName);
    if (index < 0) {
      return;
    }
    if (this.inventory[index]?.getIsConsumable()) {
      this.inventory.splice(index, 1);
    }
  }

  useItemWithId(itemName: string, id: string): void {
    const index = this.inventory.findIndex(
      (item) => item.getName() === itemName && item.getKeyID() === id,
    );
    if (index < 0) {
      return;
    }
    if (this.inventory[index]?.getIsConsumable()) {
      this.inventory.splice(index, 1);
    }
  }

  useKey(id: string): void {
    const index = this.inventory.findIndex((item) => item.getKeyID() === id);
    if (index < 0) {
      return;
    }
    if (this.inventory[index]?.getIsConsumable()) {
      this.inventory.splice(index, 1);
    }
  }
}
