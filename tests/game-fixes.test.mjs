import test from 'node:test';
import assert from 'node:assert/strict';
import { newTic, ticMove, ticResult, ticAI, newDots, dotsMove } from '../dist/rules.js';

test('tic-tac-toe ends before the board is full when every line is blocked', () => {
  let s=newTic();
  for(const square of [0,1,2,4,3,5,7]){
    s=ticMove(s,square);
    assert.equal(s.result,null,'A win is still possible before the final blocking move');
  }
  s=ticMove(s,6);
  assert.equal(s.board[8],0);
  assert.equal(s.result.winner,'draw');
  assert.equal(s.result.reason,'blocked');
  assert.equal(ticMove(s,8),null);
  assert.equal(ticAI(s,'gentle'),null);
  assert.equal(ticAI(s,'tricky'),null);
});

test('a possible line keeps play going and a completed line wins', () => {
  assert.equal(ticResult([1,2,1,1,2,0,2,1,0]),null);
  assert.equal(ticResult([1,1,1,2,2,0,0,0,0]).winner,1);
  assert.equal(ticResult([1,1,2,1,2,0,2,0,0]).winner,2);
});

test('dots gives a box to whoever closes it, not the majority of its edges', () => {
  let s=newDots(2);
  for(const [axis,index] of [['h',0],['h',1],['h',2],['h',3],['v',0],['v',1]])s=dotsMove(s,axis,index);
  assert.equal(s.boxes[0],2,'Coral closes the first box even though three of its edges are blue');
  assert.equal(s.turn,2,'Closing a box earns another turn');
  s=dotsMove(s,'h',4); // Coral uses the extra turn without scoring.
  s=dotsMove(s,'v',2); // Blue closes the second box, whose other three edges are coral.
  assert.deepEqual(s.boxes,[2,1,0,0]);
  assert.equal(s.turn,1);
  const restored=JSON.parse(JSON.stringify(s));
  const next=dotsMove(restored,'h',5);
  assert.deepEqual(next.boxes,[2,1,0,0],'Existing ownership survives saving and later moves');
});
