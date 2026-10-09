import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateLayout, footprint} from '../.test-build/domain/furniture.js';
import {findPath} from '../.test-build/domain/navigation.js';
import {execute,createSession,activeAttempt,blankPlan} from '../.test-build/domain/project.js';
import {compareChoice,revisionDiff} from '../.test-build/domain/plan-comparison.js';
const desk={id:'desk',x:4,y:16,direction:'S'};
const actor=[15,14];
test('preview rejects overlaps, entry, boundaries, blocked fronts and actor; rotation changes footprint',()=>{
 assert.equal(validateLayout([desk]),null);
 assert.match(validateLayout([{...desk,x:7,y:15}]),/ทางเข้า/);
 assert.match(validateLayout([{...desk,x:7,y:20}]),/ทั้งหมด/);
 assert.match(validateLayout([desk,{id:'plant-1',x:4,y:16,direction:'S'}]),/ทับ/);
 assert.match(validateLayout([desk,{id:'plant-1',x:4,y:17,direction:'S'},{id:'plant-2',x:5,y:17,direction:'S'}]),/ทาง/);
 assert.match(validateLayout([desk],[4,16]),/ตัวละคร/);
 assert.deepEqual(footprint({...desk,direction:'E'}),{x:4,y:16,width:1,height:2});
});
test('furniture placement, failed move, store, undo and redo preserve resources and original layout',()=>{
 let s=execute(createSession(),{id:'place',type:'furniture',placement:desk,actor});
 const saved=structuredClone(s);
 assert.throws(()=>execute(s,{id:'bad',type:'furniture',placement:{...desk,x:7,y:20},actor}),/ทั้งหมด/);
 assert.deepEqual(s,saved);
 s=execute(s,{id:'store',type:'store',itemId:'desk'});assert.equal(activeAttempt(s).layout.length,0);
 assert.throws(()=>execute(s,{id:'blocked-undo',type:'undo-layout',actor:[4,16]}),/ตัวละคร/);
 s=execute(s,{id:'undo',type:'undo-layout',actor});assert.deepEqual(activeAttempt(s).layout,[desk]);
 s=execute(s,{id:'redo',type:'redo-layout',actor});assert.equal(activeAttempt(s).layout.length,0);
 assert.equal(activeAttempt(s).remaining,4000);assert.deepEqual(activeAttempt(s).lots,[]);
});
test('dynamic blockers reroute walking and never enter the furniture footprint',()=>{
 const path=findPath([7,15],[[4,17]],[footprint(desk)]);
 assert.ok(path);assert.ok(path.every(([x,y])=>!(y===16&&(x===4||x===5))));
});
test('comparison uses player quantities, rejects blanks and distinguishes insufficient reserve from floor',()=>{
 assert.equal(compareChoice(blankPlan(),'A'),null);
 assert.equal(compareChoice({...blankPlan(),boxesA:'1.5'},'A'),null);
 assert.equal(compareChoice({...blankPlan(),boxesA:'17'},'A').coverageReady,false);
 assert.equal(compareChoice({...blankPlan(),boxesB:'14'},'B').remaining,500);
});
test('revision evidence keeps old layout, practice help and budget immutable across editing and reset',()=>{
 let s=execute(createSession(),{id:'help',type:'help',lessonId:'L04'});
 s=execute(s,{id:'p1',type:'plan',plan:{...blankPlan(),boxesA:'17'}});
 s=execute(s,{id:'f',type:'furniture',placement:desk,actor});
 s=execute(s,{id:'p2',type:'plan',plan:{...blankPlan(),boxesA:'18'}});
 const a=activeAttempt(s),first=a.plans[0],latest=a.plans[1];
 assert.deepEqual(first.context.layout,[]);assert.deepEqual(latest.context.layout,[desk]);assert.deepEqual(first.context.helpUsed,['L04']);
 assert.deepEqual(revisionDiff(first,latest),[{field:'boxesA',before:'17',after:'18'}]);
 s=execute(s,{id:'reset',type:'reset'});assert.deepEqual(s.attempts[0].plans[0],first);assert.deepEqual(activeAttempt(s).layout,[]);
});
