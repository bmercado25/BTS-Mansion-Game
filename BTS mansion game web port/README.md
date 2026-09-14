# BTS Mansion Game — Web Port

Browser port of **BTS Mansion Game**.

- C++ original (source of truth): [`../BTS Mansion Game`](../BTS%20Mansion%20Game)
- Stack: **Vite + TypeScript** (vanilla)

## Phase 7d status

**Gallery puzzle** ported (`ALTAR`):

1. `YES` to start
2. Touch `CRIMSON LORD PORTRAIT` (exact name)
3. Success → `GALLERY HALF KEY` (combines with mirror half into `MASTER KEY`)

Also live: Mirror, Fountain, Maze. Still stubbed: chant, memory

## Run

```bash
cd "BTS mansion game web port"
npm install
npm run dev
```

## Deploy (Vercel)

Production build:

```bash
cd "BTS mansion game web port"
npm ci
npm run build
```

Output is `dist/` (static Vite site + `public/audio`).

### Option A — whole repo (recommended)

Root [`vercel.json`](../vercel.json) already points install/build/output at this folder. In Vercel:

1. Import the GitHub repo
2. Leave **Root Directory** empty (repo root)
3. Deploy — no extra settings needed

### Option B — Root Directory = this folder

Set **Root Directory** to `BTS mansion game web port`. The local `vercel.json` in this folder applies (`npm run build` → `dist`).

Requires **Node 20+**.
