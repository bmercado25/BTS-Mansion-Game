# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 4 status

Mini game loop (`GameController`) with a tiny world:

- **FOYER** ↔ **LOUNGE** (RUSTY KEY)
- Locked **DOOR** → **LIBRARY** (needs key `BBBB`)

Commands: room/exit names, `INSPECT`, `PICKUP`, `INVENTORY`, `QUIT`

## Critical path

1. `START`
2. `LOUNGE` → `INSPECT` / `PICKUP` → `RUSTY KEY`
3. `FOYER` → `DOOR` (unlock) → `LIBRARY`
4. `INVENTORY` · `QUIT`

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).
