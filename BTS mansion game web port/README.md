# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 5a status

Downstairs world ported into `GameController`:

- FOYER, LOUNGE, LIBRARY, GREATER LIBRARY, STUDY
- HIDDEN SECTION, RITUAL ROOM
- DINING HALL, KITCHEN

Locks / keys: `RUSTY KEY` → DOOR, `OLD BOOK` → BOOKSHELF, dining safe `8691` → `DINING HALL KEY` → GREATER LIBRARY DOOR, study gate word `YDDID`

Stubbed: upstairs / PORTAL / garden / real puzzle modules

## Suggested downstairs path

1. `START` in FOYER  
2. `LOUNGE` → pick up `RUSTY KEY`  
3. `FOYER` → `DOOR` → `LIBRARY`  
4. Pick up `OLD BOOK` → `BOOKSHELF` → `HIDDEN SECTION` → candle  
5. `DINING HALL` via lounge door → safe `8691` → `GREATER LIBRARY DOOR`  
6. `PUZZLE` / `YDDID` → `STUDY` → second candle → `RITUAL ROOM`

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```
