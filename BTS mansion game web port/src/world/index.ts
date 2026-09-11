import type { Room } from "../domain";
import { buildDownstairsWorld } from "./downstairs";
import { buildUpstairsWorld } from "./upstairs";
import { buildOutdoorWorld } from "./outdoor";

/** Merge downstairs (5a) + upstairs (5b) + outdoor (5c). */
export function buildMansionWorld(): Map<string, Room> {
  const rooms = buildDownstairsWorld();
  for (const [name, room] of buildUpstairsWorld()) {
    rooms.set(name, room);
  }
  for (const [name, room] of buildOutdoorWorld()) {
    rooms.set(name, room);
  }
  return rooms;
}

export { buildDownstairsWorld, createDiningHallKey } from "./downstairs";
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
