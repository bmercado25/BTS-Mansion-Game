# Port gaps vs latest C++ (Joey sync)

Source of truth: `../BTS Mansion Game/` (GameControllerClass, MonsterClass, GreaterLibraryPuzzle).  
Web port: this folder. Execute revisions in order **R2 → R10** (see below).

---

## 1) Missing in the port

| System | C++ reference | Notes |
|--------|---------------|--------|
| Monster timer | `MonsterClass` (120s) | 15s warning, grab ASCII + jumpscare, −30 sanity, death if ≤0 |
| Hide / safe rooms | `RoomClass.isSafe` | LIBRARY TABLE, LOUNGE CLOSET, STUDY DESK, DINING TABLE, PANTRY, beds/tables, SHED CLOSET, MEMORY TABLE |
| Protected state | `isInProtectedAction` | Freezes monster countdown; skips grab; set during inspect/inventory/candles; safe rooms |
| Greater Library Puzzle | `GreaterLibraryPuzzle` | WORD LOCK answer `DODGE`; awards STUDY KEY |
| Clue books | GREATER LIBRARY items | PRISTINE / GRASSY / WOODEN / DIRTY / TATTERED (spell DODGE) |
| STUDY DOOR + STUDY KEY | Door `STUDYKEY` | Replaces old `PUZZLE` / `YDDID` path |
| Rooms | GameController world setup | GUESTROOM, BALLROOM, BATHROOM (+ lounge/shed hide links) |
| Lore pickups | Journals 1–5, NEWSPAPER CLIPPING, BATHROOM/BALLROOM notes | Ending clues (HENRY / story) |
| Ritual letter reveals | C1–C5 prompts | Letters **M A L U M** |
| `playTeleportSequence` | C4 place / C4 maze pickup | Stylized spam → clear |
| C4 maze pickup → ritual | HEDGE MAZE EXIT pickup | Teleport to RITUAL ROOM |
| `endingSequence` | After C5 place | SAY MY NAME → HENRY / MALUM / bad |
| Three endings text | `goodEnding` / `neutralEnding` / `badEnding` | Line-by-line + waitForInput |
| Sanity jumble UI | `displayPrompt(text, sanity)` | Jumble when sanity ≤ 35 |
| `SANITY` command | Game loop | Quick sanity readout |
| Backstory | `displayBackstory` | Currently commented out in C++ start; still content to port |
| Audio | `PlaySound` + item `soundFileName` | Browser `Audio` adaptation (R9) |

---

## 2) Exists but differs

| System | Latest C++ | Port today | Fix phase |
|--------|------------|------------|-----------|
| Study gate | WORD LOCK → `DODGE` → STUDY KEY → STUDY DOOR | Ported (R3) | done |
| Ritual win | C5 → `endingSequence` (name the demon/friend) | `winGame()` when candle count ≥ 5 | **R6–R7** |
| C4 memory entry | Place C4 → teleport to MEMORY OF THE MANSION + sequence | Opens MEMORY exit from ritual; no forced teleport / sequence | **R6** |
| C3–C5 placement | Full branches + letters; C3/C4/C5 may skip `addCandle` in C++ | Places C3–C5 + custom memory rift on C4 | **R6** |
| Sanity drain | **−1** / 9s | **−2** / 9s | **R5** |
| Lose messaging | Sanity / monster / bad ending variants | Single lose blurb (+ invented win) | **R5 / R7** |
| Memory copy | Updated descriptions + garbled Sight text + MEMORY TABLE | Older/temporary letter-room text | **R2 / R8** |
| Pentacle art | Latest C++ draws one static pentacle | Staged 0–5 art (better UX; keep unless matching static) | Optional **R8** |
| Candle5 | Key id `"C5"` | Port already uses C5 | Align only |
| Chant → ritual | Roar + teleport after C5 awarded | Teleport + award (close) | **R8** copy/timing |

---

## 3) Critical paths (all endings)

Shared spine (must work before any ending):

1. **FOYER** → LOUNGE → RUSTY KEY → **DOOR** → LIBRARY  
2. OLD BOOK → **BOOKSHELF** → HIDDEN SECTION → **C1** → RITUAL → place C1 → **KITCHEN** tunnel  
3. Dining / safe `8691` → GREATER LIBRARY KEY → **GREATER LIBRARY DOOR**  
4. Greater Library books → **WORD LOCK** = `DODGE` → **STUDY KEY** → **STUDY DOOR** → STUDY → **C2**  
5. Ritual place C2 → **PORTAL** → upstairs  
6. Gallery + Mirror half-keys → MASTER KEY → **DOUBLE DOORS** → MASTER → **C3** → place C3 (letter L)  
7. Garden → Fountain (holy water) → Maze → map → **HEDGE MAZE EXIT** → **C4**  
   - Pickup C4 may warp to ritual; place C4 → letters U + **teleport to memory**  
8. Memory letter rooms (or Sight after Memory Puzzle + goblet) → chant  
   `EXTINGUE FLAMMAM PECCATORUM TUORUM` → **C5** → ritual  
9. Place **C5** → `endingSequence`

### Ending branches (after C5)

| Ending | Input during “SAY MY NAME” (≤3 tries) | Result |
|--------|----------------------------------------|--------|
| **Good** | `HENRY` (any case → uppercased) | `goodEnding` |
| **Neutral** | `MALUM` and never `HENRY` | `neutralEnding` |
| **Bad** | Neither name given in time | `badEnding` |

Clue sources: ritual letters → **MALUM**; journals / newspaper → **HENRY**.

### Parallel lose paths (not endings)

- Sanity &lt; 2 (drain) → `endGame`  
- Monster grab when sanity ≤ 0 after −30 → `endGame`  
- `QUIT` → stop timers → `endGame`

---

## Phase checklist (execute next)

- [x] **R2** World: rooms, hides (`isSafe`), journals/notes  
- [x] **R3** Greater Library Puzzle; remove YDDID/PUZZLE  
- [x] **R4** Monster timer + protected + hide reset  
- [ ] **R5** Sanity −1/9s + jumble + SANITY command  
- [ ] **R6** Ritual letters, C4 teleports, drop fake 5-candle win  
- [ ] **R7** `endingSequence` (HENRY / MALUM / bad)  
- [ ] **R8** Copy/backstory/string sync  
- [ ] **R9** Audio (optional)  
- [ ] **R10** Full playthrough softlock sweep  

---

## Already in good shape (keep)

- Terminal / UI async shell (`print` / `ask` / `sleep` / `clear` / `cancelAsk`)  
- Puzzle runners: Mirror, Fountain, Maze, Gallery, Chant, Memory (verify strings in R8)  
- Core domain: Player, Item, Door, Room, inventory, doors/keys for older map  
- Ritual C1/C2 kitchen + portal unlocks (extend, don’t scrap)
