import type { Room } from "../domain";
import { buildDownstairsWorld } from "./downstairs";
import { buildUpstairsWorld } from "./upstairs";

/** Merge downstairs (5a) + upstairs/gallery/master (5b). */
export function buildMansionWorld(): Map<string, Room> {
  const rooms = buildDownstairsWorld();
  for (const [name, room] of buildUpstairsWorld()) {
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
