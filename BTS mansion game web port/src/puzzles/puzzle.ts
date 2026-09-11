/**
 * Browser port of C++ Puzzle base class.
 */
export class Puzzle {
  protected isSolvedFlag = false;
  protected description = "";

  constructor(description = "") {
    this.description = description;
  }

  getDescription(): string {
    return this.description;
  }

  isSolved(): boolean {
    return this.isSolvedFlag;
  }

  solve(): void {
    if (!this.isSolvedFlag) {
      this.isSolvedFlag = true;
    }
  }
}
