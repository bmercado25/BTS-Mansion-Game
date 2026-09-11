/**
 * Optional interaction hook stub (full InteractClass arrives in a later phase).
 */
export type InteractionHook = {
  /** Special handler id used by GameController. */
  kind?: "message" | "safe" | "puzzle" | "stub";
  /** Prompt shown when inspecting / interacting (C++ inputMessage). */
  inputMessage?: string;
  /** Result text after interacting (C++ interactMessage). */
  outputMessage?: string;
};

export type ItemOptions = {
  name?: string;
  description?: string;
  keyId?: string;
  value?: number;
  isConsumable?: boolean;
  canPickUp?: boolean;
  interaction?: InteractionHook | null;
  canExpire?: boolean;
};

/**
 * Browser port of C++ ItemClass.
 */
export class Item {
  name: string;
  description: string;
  keyId: string;
  value: number;
  isConsumable: boolean;
  canPickUp: boolean;
  interaction: InteractionHook | null;
  canExpire: boolean;

  constructor(options: ItemOptions = {}) {
    this.name = options.name ?? " ";
    this.description = options.description ?? " ";
    this.keyId = options.keyId ?? " ";
    this.value = options.value ?? 0;
    this.isConsumable = options.isConsumable ?? false;
    this.canPickUp = options.canPickUp ?? false;
    this.interaction = options.interaction ?? null;
    this.canExpire = options.canExpire ?? false;
  }

  /** Unknown / not-found sentinel (C++ unknownItem). */
  static unknown(): Item {
    return new Item({ name: "Unknown", description: "Item not found" });
  }

  static note(name: string, description: string, canPickUp = true): Item {
    return new Item({ name, description, canPickUp });
  }

  static key(
    name: string,
    description: string,
    keyId: string,
    isConsumable = true,
    canPickUp = true,
  ): Item {
    return new Item({ name, description, keyId, isConsumable, canPickUp });
  }

  static consumable(
    name: string,
    description: string,
    value: number,
    isConsumable = true,
    canPickUp = true,
  ): Item {
    return new Item({ name, description, value, isConsumable, canPickUp });
  }

  static interactable(
    name: string,
    description: string,
    canPickUp: boolean,
    interaction: InteractionHook | null = null,
  ): Item {
    return new Item({ name, description, canPickUp, interaction });
  }

  getName(): string {
    return this.name;
  }

  setName(newName: string): void {
    this.name = newName;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(newDescription: string): void {
    this.description = newDescription;
  }

  getKeyID(): string {
    return this.keyId;
  }

  setKeyID(id: string): void {
    this.keyId = id;
  }

  getValue(): number {
    return this.value;
  }

  setValue(val: number): void {
    this.value = val;
  }

  getIsConsumable(): boolean {
    return this.isConsumable;
  }

  setIsConsumable(consumable: boolean): void {
    this.isConsumable = consumable;
  }

  getCanPickUp(): boolean {
    return this.canPickUp;
  }

  setCanPickUp(pickUp: boolean): void {
    this.canPickUp = pickUp;
  }

  getInteraction(): InteractionHook | null {
    return this.interaction;
  }

  setInteraction(interact: InteractionHook | null): void {
    this.interaction = interact;
  }
}
