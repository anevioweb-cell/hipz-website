import { describe, expect, it } from 'vitest';
import { story, storySections, visibleOptional } from './story.js';
import { creatorPhotos } from './creators.js';

const selected = creatorPhotos.filter((c) => c.selected);
const src = (kind = 'owner') => ({ kind, ref: 'test fixture' });
// FAKE data for tests only — never real facts
const full = {
  ...story,
  foundedYear: { value: 1999, source: src() },
  plantName: { value: 'Test Plant', source: src() },
  plantCity: { value: 'Test City', source: src() },
  originNote: { en: 'Test origin note.', source: src() },
  quotes: [
    { original: 'نص تجريبي', lang: 'ar', translation: 'Test text', by: 'Test', source: src() },
  ],
  milestones: [{ label: 'Test milestone', date: '1999-01-01', source: src() }],
};

describe('story data', () => {
  it('keeps every optional field empty in the real file', () => {
    expect(story.foundedYear).toBeNull();
    expect(story.plantName).toBeNull();
    expect(story.plantCity).toBeNull();
    expect(story.originNote).toBeNull();
    expect(story.quotes).toEqual([]);
    expect(story.milestones).toEqual([]);
  });
  it('gives every confirmed fact a source', () => {
    for (const [k, f] of Object.entries(story.confirmed)) {
      expect(f.fact, k).toBeTruthy();
      expect(f.source.ref, k).toBeTruthy();
    }
  });
  it('shows only the confirmed sections with the real (minimum) data', () => {
    expect(storySections(story, selected)).toEqual([
      'hero',
      'duo',
      'collage',
      'bottling',
      'flavors',
      'closing',
    ]);
  });
  it('shows every optional section with full (fake) data', () => {
    expect(storySections(full, selected)).toEqual([
      'hero',
      'duo',
      'collage',
      'bottling',
      'flavors',
      'origin',
      'milestones',
      'quotes',
      'plant',
      'closing',
    ]);
  });
  it('hides launch-video entries until verified, and quotes without original + translation', () => {
    const video = {
      ...story,
      originNote: { en: 'From the video.', source: src('launch-video') },
      quotes: [
        { original: 'نص', lang: 'ar', translation: 'Text', by: 'X', source: src('launch-video') },
        { original: 'نص', lang: 'ar', translation: '', by: 'X', source: src(), verified: true },
      ],
      milestones: [{ label: 'Launch post', date: '2026-10-23', source: src('launch-video') }],
    };
    let o = visibleOptional(video);
    expect(o.originNote).toBeNull();
    expect(o.quotes).toEqual([]);
    expect(o.milestones).toEqual([]);
    const verified = {
      ...video,
      originNote: { ...video.originNote, verified: true },
      quotes: video.quotes.map((q) => ({ ...q, verified: true })),
      milestones: video.milestones.map((m) => ({ ...m, verified: true })),
    };
    o = visibleOptional(verified);
    expect(o.originNote.en).toBe('From the video.');
    expect(o.quotes).toHaveLength(1); // the one with an empty translation stays hidden
    expect(o.milestones).toHaveLength(1);
  });
  it('drops optional entries without a source', () => {
    expect(visibleOptional({ ...story, plantCity: { value: 'X' } }).plant).toBeNull();
  });
});
