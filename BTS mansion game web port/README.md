# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 5b status

Upstairs wing added on top of downstairs:

- UPSTAIRS, MIRROR ROOM 1 / 2, STORYTELLER'S ROOM, GALLERY, MASTER BEDROOM
- PORTAL: Ritual (C2 candle) ↔ UPSTAIRS ↔ FOYER
- DOUBLE DOORS gated by MASTER KEY (`idMaster`)
- Gallery / Mirror puzzles are stubs that still award half-keys so the lock can be tested
- GARDEN exit stubbed (Phase 5c)

## Reach upstairs

1. Downstairs → STUDY candle (C2) → RITUAL ROOM → `CANDLE` → `PORTAL`
2. Explore GALLERY / COMBINATION LOCK (YES on stubs) → MASTER KEY → `DOUBLE DOORS` → MASTER BEDROOM

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```
