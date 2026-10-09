import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCENE, findPath, walkable, project, unproject, inside } from '../.test-build/domain/navigation.js';

test('every designed interaction is reachable and paths never cross solid objects', () => {
  for (const object of SCENE.staticObjects) {
    if (!object.interactionCells.length) continue;
    const path = findPath(SCENE.playerSpawn, object.interactionCells);
    assert.ok(path, object.label);
    assert.ok(path.every(walkable));
    for (let i = 1; i < path.length; i++) assert.equal(Math.abs(path[i][0] - path[i-1][0]) + Math.abs(path[i][1] - path[i-1][1]), 1);
  }
});
test('blocked/out-of-bounds goals cannot produce a route; spawn/floor entry are walkable', () => {
  assert.equal(findPath(SCENE.playerSpawn, [[4, 2]]), null);
  assert.equal(findPath(SCENE.playerSpawn, [[32, 24]]), null);
  assert.ok(walkable(SCENE.playerSpawn));
  assert.ok(walkable(SCENE.projectFloor.reservedEntry));
  for (const object of SCENE.staticObjects) for (const road of SCENE.protectedPaths) {
    for (let x = object.x; x < object.x + object.width; x++) for (let y = object.y; y < object.y + object.height; y++) assert.equal(inside(x, y, road), false);
  }
});
test('projection and inverse preserve cell centres throughout the 32×24 grid', () => {
  for (let x = 0; x < 32; x++) for (let y = 0; y < 24; y++) {
    const pixel = project(x + 0.5, y + 0.5);
    assert.deepEqual(unproject(pixel.x, pixel.y), { x: x + 0.5, y: y + 0.5 });
  }
});
