# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 6 status

Non-puzzle `Interact` flows match C++ `InteractClass::runInteraction()`:

- Prompt → `Enter action (INTERACT):` → `INTERACT` shows result / else walk away
- Covers statue, dead bodies, kitchen counter, portraits, storybook
- `METAL SAFE` keeps the C++ inspect special-case (code `8691`)
- Puzzle starters remain stubs (Phase 7)

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```
