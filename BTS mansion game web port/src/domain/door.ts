/**
 * Browser port of C++ Door.
 */
export class Door {
  private isLocked: boolean;
  private doorKeyId: string;
  private openDoorDescription: string;
  private doorName: string;

  constructor(
    locked = false,
    id = " ",
    openDescription = "",
    name = "",
  ) {
    this.isLocked = locked;
    this.doorKeyId = id;
    this.openDoorDescription = openDescription;
    this.doorName = name;
  }

  getIsLocked(): boolean {
    return this.isLocked;
  }

  getDoorKeyID(): string {
    return this.doorKeyId;
  }

  setDoorKeyID(id: string): void {
    this.doorKeyId = id;
  }

  getDoorName(): string {
    return this.doorName;
  }

  unlockDoor(): void {
    this.isLocked = false;
  }

  returnOpenDoorDescription(): string {
    return this.openDoorDescription;
  }
}
