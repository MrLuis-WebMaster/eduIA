import assert from 'node:assert/strict';
import test from 'node:test';
import { validateSession } from './booking-rules';

const base = {
  mode: 'ONLINE', provider: 'MEET',
  startsAt: '2026-12-01T15:00:00-05:00',
  endsAt: '2026-12-01T16:00:00-05:00',
  capacity: 4,
};

test('accepts online session with provider', () => {
  assert.equal(validateSession(base).valid, true);
});

test('rejects onsite without location', () => {
  assert.equal(validateSession({ ...base, mode: 'ONSITE', provider: null }).valid, false);
});

test('accepts hybrid with provider and location', () => {
  assert.equal(validateSession({ ...base, mode: 'HYBRID', location: 'Sede Centro, Aula 2' }).valid, true);
});

test('rejects inverted times', () => {
  assert.equal(validateSession({ ...base, endsAt: '2026-12-01T14:00:00-05:00' }).valid, false);
});

test('requires URL for custom meeting', () => {
  assert.equal(validateSession({ ...base, provider: 'CUSTOM' }).valid, false);
});
