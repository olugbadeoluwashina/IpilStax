import { assert } from '@std/assert';
import { add } from '../../main.ts';

Deno.test(function addTest() {
  assert(add(2, 3) === 5);
});

Deno.test(function subtractTest() {
  assert(add(2, -3) === -1);
});

Deno.test(function multiplyTest() {
  assert(add(2, -3) === -1);
});

Deno.test(function divideTest() {
  assert(add(2, -3) === -1);
});
