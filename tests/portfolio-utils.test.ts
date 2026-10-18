import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStreaks,
  parseTerminalCommand,
  validateContactForm,
  type ContributionDay
} from '../src/lib/portfolio-utils.ts';

test('calculateStreaks: empty contributions returns zeroes', () => {
  const result = calculateStreaks([], new Date('2026-10-17T12:00:00Z'));
  assert.equal(result.currentStreak, 0);
  assert.equal(result.longestStreak, 0);
});

test('calculateStreaks: evaluates current and longest streaks correctly with commit today', () => {
  const refDate = new Date('2026-10-17T12:00:00Z');
  const contributions: ContributionDay[] = [
    { date: '2026-10-10', count: 2, level: 1 },
    { date: '2026-10-11', count: 3, level: 2 },
    { date: '2026-10-12', count: 0, level: 0 }, // break
    { date: '2026-10-13', count: 1, level: 1 },
    { date: '2026-10-14', count: 4, level: 3 },
    { date: '2026-10-15', count: 1, level: 1 },
    { date: '2026-10-16', count: 2, level: 2 },
    { date: '2026-10-17', count: 5, level: 4 }, // today
  ];

  const result = calculateStreaks(contributions, refDate);
  assert.equal(result.currentStreak, 5); // 13, 14, 15, 16, 17
  assert.equal(result.longestStreak, 5);
});

test('calculateStreaks: maintains streak if commit was yesterday but not yet today', () => {
  const refDate = new Date('2026-10-17T12:00:00Z');
  const contributions: ContributionDay[] = [
    { date: '2026-10-14', count: 1, level: 1 },
    { date: '2026-10-15', count: 2, level: 1 },
    { date: '2026-10-16', count: 3, level: 2 }, // yesterday
    { date: '2026-10-17', count: 0, level: 0 }, // today (no commits yet)
  ];

  const result = calculateStreaks(contributions, refDate);
  assert.equal(result.currentStreak, 3);
  assert.equal(result.longestStreak, 3);
});

test('calculateStreaks: resets current streak to 0 if no commits for 2+ days but preserves longest', () => {
  const refDate = new Date('2026-10-17T12:00:00Z');
  const contributions: ContributionDay[] = [
    { date: '2026-10-10', count: 1, level: 1 },
    { date: '2026-10-11', count: 2, level: 1 },
    { date: '2026-10-12', count: 3, level: 2 },
    { date: '2026-10-13', count: 4, level: 3 }, // 4-day streak
    { date: '2026-10-14', count: 0, level: 0 },
    { date: '2026-10-15', count: 0, level: 0 },
    { date: '2026-10-16', count: 0, level: 0 },
    { date: '2026-10-17', count: 0, level: 0 },
  ];

  const result = calculateStreaks(contributions, refDate);
  assert.equal(result.currentStreak, 0);
  assert.equal(result.longestStreak, 4);
});

test('parseTerminalCommand: handles built-in commands', () => {
  assert.deepEqual(parseTerminalCommand('help'), { type: 'help' });
  assert.deepEqual(parseTerminalCommand('clear'), { type: 'clear' });
  assert.deepEqual(parseTerminalCommand('exit'), { type: 'exit' });
  assert.deepEqual(parseTerminalCommand('close'), { type: 'exit' });
  assert.deepEqual(parseTerminalCommand('resume'), { type: 'resume' });
});

test('parseTerminalCommand: handles navigation shortcuts', () => {
  assert.deepEqual(parseTerminalCommand('projects'), { type: 'navigate', section: 'projects' });
  assert.deepEqual(parseTerminalCommand('work'), { type: 'navigate', section: 'projects' });
  assert.deepEqual(parseTerminalCommand('skills'), { type: 'navigate', section: 'skills' });
  assert.deepEqual(parseTerminalCommand('education'), { type: 'navigate', section: 'education' });
  assert.deepEqual(parseTerminalCommand('github'), { type: 'navigate', section: 'github' });
  assert.deepEqual(parseTerminalCommand('contact'), { type: 'navigate', section: 'contact' });
});

test('parseTerminalCommand: handles unknown and empty commands', () => {
  assert.deepEqual(parseTerminalCommand(''), { type: 'unknown', command: '' });
  assert.deepEqual(parseTerminalCommand('foobar --flag'), { type: 'unknown', command: 'foobar' });
});

test('validateContactForm: passes on valid input without file', () => {
  const result = validateContactForm({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    message: 'Excited about your 3D portfolio!',
  });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateContactForm: detects missing and malformed inputs', () => {
  const result = validateContactForm({
    name: '',
    email: 'invalid-email-address',
    message: '   ',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm: validates file extension and size', () => {
  // Disallowed extension
  const badExt = validateContactForm({
    name: 'John',
    email: 'john@example.com',
    message: 'Hi',
    file: { name: 'script.exe', size: 1024 },
  });
  assert.equal(badExt.isValid, false);
  assert.match(badExt.errors.file, /Only \.pdf, \.doc, or \.docx/);

  // File size exceeded
  const oversized = validateContactForm({
    name: 'John',
    email: 'john@example.com',
    message: 'Hi',
    file: { name: 'document.pdf', size: 6 * 1024 * 1024 },
  });
  assert.equal(oversized.isValid, false);
  assert.match(oversized.errors.file, /5MB limit/);

  // Valid file
  const valid = validateContactForm({
    name: 'John',
    email: 'john@example.com',
    message: 'Hi',
    file: { name: 'resume.pdf', size: 2 * 1024 * 1024 },
  });
  assert.equal(valid.isValid, true);
});
