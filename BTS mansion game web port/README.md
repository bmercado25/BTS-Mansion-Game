# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 5c status

Full mansion topology walkable (puzzles still stubbed):

- Downstairs + upstairs + **GARDEN / SHED / FOUNTAIN / HEDGE MAZE / HEDGE MAZE EXIT**
- Fountain stub → `HOLY WATER` → `BLOCKED HEDGE MAZE`
- Maze lantern stub → `MAZE MAP` → `MAZE EXIT` → candle C4
- Ritual accepts C1–C4 candle placement (C1 kitchen tunnel, C2 portal)

Not yet: memory mansion wing, real puzzle solvers, sanity timer

## Outdoor path

1. MASTER BEDROOM → `GARDEN`
2. `FOUNTAIN` → FOUNTAIN PANEL (YES) → HOLY WATER
3. `BLOCKED HEDGE MAZE` → `HEDGE MAZE`
4. LANTERN (YES) → MAZE MAP → `MAZE EXIT` → `HEDGE MAZE EXIT`

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```
