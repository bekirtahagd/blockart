import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PALETTE,validateBlocks,keyOf,translateBlocks,duplicateBlocks,deleteBlocks} from '../dist/model.mjs';

// Run against a local project fixture; the fixture itself is never published.
const filename=process.argv[2];
assert.ok(filename,'Pass a local .blockart.json project path.');
const project=JSON.parse(readFileSync(filename,'utf8'));
const blocks=validateBlocks(project.blocks),original=structuredClone(blocks);
const red=blocks.filter(b=>b.color==='red'),keys=red.map(keyOf);
assert.equal(red.length,19,'Regression fixture should contain the 19-block red flower.');
for(const delta of [{x:1,y:0,z:0},{x:-1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:-1,z:0},{x:0,y:0,z:1},{x:0,y:0,z:-1},{x:0,y:0,z:-3}]){
  const moved=translateBlocks(blocks,keys,delta);
  assert.equal(moved.blocks.length,blocks.length);
  assert.equal(moved.selection.length,19);
  const restored=translateBlocks(moved.blocks,moved.selection,{x:-delta.x,y:-delta.y,z:-delta.z});
  assert.deepEqual(restored.blocks,blocks,'A whole flower can move through its own former cells and back.');
}
assert.throws(()=>translateBlocks(blocks,[keyOf(red.find(b=>b.x===-1&&b.y===10&&b.z===5))],{x:0,y:1,z:0}),error=>error.code==='collision'&&error.blockedKeys.includes('-1,11,5'));
assert.deepEqual(blocks,original,'Rejected partial moves must not alter the original project.');
const copied=duplicateBlocks(blocks,keys);
assert.equal(copied.blocks.length,113);
assert.equal(copied.selection.length,19);
assert.equal(new Set(copied.blocks.map(keyOf)).size,113);
assert.ok(copied.blocks.filter(b=>copied.selection.includes(keyOf(b))).every(b=>b.color==='red'));
assert.throws(()=>duplicateBlocks(copied.blocks,copied.selection),/freie Blöcke/);
assert.deepEqual(deleteBlocks(copied.blocks,copied.selection),blocks);
assert.equal(deleteBlocks(blocks,keys).length,75);
assert.throws(()=>duplicateBlocks(blocks,keys,{x:0,y:0,z:0}));
assert.throws(()=>deleteBlocks(blocks,['15,30,15']));
assert.throws(()=>translateBlocks(blocks,keys,{x:0,y:-10,z:0}),/Raster/);
assert.deepEqual(validateBlocks([{x:0,y:0,z:0,color:'lila'}]),[{x:0,y:0,z:0,color:'lila'}]);
assert.equal(PALETTE.find(c=>c.id==='purple').name,'Flieder');
assert.equal(PALETTE.find(c=>c.id==='lila').name,'Lila');
assert.deepEqual(blocks,original);
console.log('19-block flower: moves, collision diagnosis, duplicate/delete, inventory, immutability and Lila passed.');
