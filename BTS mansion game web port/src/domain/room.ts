import { Door } from "./door";
import { Item } from "./item";

export type RoomOptions = {
  description: string;
  name: string;
  exits?: string[];
  doors?: Door[];
  items?: Item[];
  isRitual?: boolean;
  hasConditionalDescription?: boolean;
  conditionalDescription?: string;
};

/**
 * Browser port of C++ RoomClass (puzzle wiring deferred).
 */
export class Room {
  private roomDescription: string;
  private roomName: string;
  private roomOptions: string[];
  private roomDoors: Door[];
  private items: Item[];
  private isRitual: boolean;
  private candles: number;
  private hasConditionalDescription: boolean;
  private conditionalRoomDescription: string;
  private defaultItem: Item;

  constructor(options: RoomOptions) {
    this.roomDescription = options.description;
    this.roomName = options.name;
    this.roomOptions = [...(options.exits ?? [])];
    this.roomDoors = [...(options.doors ?? [])];
    this.items = [...(options.items ?? [])];
    this.isRitual = options.isRitual ?? false;
    this.candles = 0;
    this.hasConditionalDescription = options.hasConditionalDescription ?? false;
    this.conditionalRoomDescription = options.conditionalDescription ?? "";
    this.defaultItem = new Item({ name: "NULL" });
  }

  getDoors(): Door[] {
    return this.roomDoors;
  }

  getDescription(): string {
    return this.roomDescription;
  }

  setRoomDescription(newDescription: string): void {
    this.roomDescription = newDescription;
  }

  getName(): string {
    return this.roomName;
  }

  setName(name: string): string {
    this.roomName = name;
    return this.roomName;
  }

  getRoomOptions(): string[] {
    return [...this.roomOptions];
  }

  setRoomOptions(options: string[]): void {
    this.roomOptions = [...options];
  }

  /** Exit / adjacent room names (helper). */
  listExits(): string[] {
    return this.getRoomOptions();
  }

  getItems(): Item[] {
    return this.items;
  }

  listItemNames(): string[] {
    return this.items.map((item) => item.getName());
  }

  getItemsLength(): number {
    return this.items.length;
  }

  getRoomItemByName(name: string): Item {
    const found = this.items.find((item) => item.getName() === name);
    return found ?? this.defaultItem;
  }

  addItem(itm: Item): void {
    this.items.push(itm);
  }

  removeItem(itm: Item): void {
    const index = this.items.findIndex((item) => item.getName() === itm.getName());
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  removeItemByName(name: string): Item | null {
    const index = this.items.findIndex((item) => item.getName() === name);
    if (index < 0) {
      return null;
    }
    const [removed] = this.items.splice(index, 1);
    return removed ?? null;
  }

  unlockDoorAt(doorIndex: number): void {
    const door = this.roomDoors[doorIndex];
    if (door && door.getIsLocked()) {
      door.unlockDoor();
      this.setRoomDescription(door.returnOpenDoorDescription());
    }
  }

  unlockDoorByName(doorName: string): boolean {
    const door = this.roomDoors.find((d) => d.getDoorName() === doorName);
    if (!door || !door.getIsLocked()) {
      return false;
    }
    door.unlockDoor();
    this.setRoomDescription(door.returnOpenDoorDescription());
    return true;
  }

  addCandle(): void {
    this.candles += 1;
  }

  getCandleValue(): number {
    return this.candles;
  }

  returnRitualStatus(): boolean {
    return this.isRitual;
  }

  getHasConditionalDescription(): boolean {
    return this.hasConditionalDescription;
  }

  getConditionalDescriptionText(): string {
    return this.conditionalRoomDescription;
  }

  /** Port of C++ AmendDescription — base text + item blurbs. */
  amendDescription(): string {
    let text = this.roomDescription;
    const count = this.items.length;
    if (count === 0) {
      return text;
    }

    for (let i = 0; i < count; i++) {
      const desc = this.items[i]?.getDescription() ?? "";
      if (i === 0) {
        text += ` This room contains ${desc}`;
      } else if (i !== count - 1) {
        text += `, ${desc}`;
      } else {
        text += ` and ${desc}.`;
      }
    }
    return text;
  }
}
