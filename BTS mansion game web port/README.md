# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 7a status

**Mirror puzzle** ported (`COMBINATION LOCK` upstairs):

1. `INSPECT` → `COMBINATION LOCK`
2. Enter three words (exact C++ answers): `MOONLIGHT` · `FOREST GREEN` · `BLACK`
3. Success → `MIRROR HALF KEY` (combines with gallery half into `MASTER KEY`)

Still stubbed: gallery, fountain, maze, chant, memory

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```
