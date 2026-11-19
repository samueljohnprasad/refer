// ponytail: maps a finished ThoughtCatcherDraft into onboarding's canonical ReflectionData shape (the one
// format home.html's "mine" card already renders off) and replaces-by-id into home's reflections array.
import type { ReflectionData } from '@/src/domains/onboarding/domain/types';
import { upsertReflection } from '@/src/domains/home/data/reflectionsStorage';
import type { ThoughtCatcherDraft } from '../domain/types';
import { toBeliefBucket } from '../domain/scoring';

export async function saveThoughtCatcherReflection(draft: ThoughtCatcherDraft, id: string): Promise<void> {
  const reflection: ReflectionData = {
    id,
    goal: null,
    source: 'personal',
    situation: '',
    thought: draft.thought,
    ...(draft.trap && { trap: draft.trap }),
    why: '',
    fair: draft.checked ? draft.balanced.trim() : '',
    before: toBeliefBucket(draft.intensity),
    after: draft.checked ? toBeliefBucket(draft.post ?? draft.intensity) : null,
    reminder: null,
  };
  await upsertReflection(reflection);
}
