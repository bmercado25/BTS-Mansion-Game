import type { Room } from "../domain";
import { buildDownstairsWorld } from "./downstairs";
import { buildUpstairsWorld } from "./upstairs";
import { buildOutdoorWorld } from "./outdoor";
import { buildMemoryWing } from "./memory";

/** Merge downstairs + upstairs + outdoor + memory shell. */
export function buildMansionWorld(): Map<string, Room> {
  const rooms = buildDownstairsWorld();
  for (const [name, room] of buildUpstairsWorld()) {
    rooms.set(name, room);
  }
  for (const [name, room] of buildOutdoorWorld()) {
    rooms.set(name, room);
  }
  for (const [name, room] of buildMemoryWing()) {
    rooms.set(name, room);
  }
  return rooms;
}

export { buildDownstairsWorld, createDiningHallKey, createStudyKey } from "./downstairs";
export {
  buildUpstairsWorld,
  createGalleryHalfKey,
  createMirrorHalfKey,
  createMasterKey,
} from "./upstairs";
export {
  buildOutdoorWorld,
  createHolyWater,
  createMazeMap,
  createCandle4,
} from "./outdoor";
export { buildMemoryWing, createCandle5, createPlayerMemory, createSight } from "./memory";
