const ACTOR_KEY = 'patch-actor-id';

export function getActorId() {
  if (typeof window === 'undefined') return 'server-anonymous';
  const existing = window.localStorage.getItem(ACTOR_KEY);
  if (existing) return existing;
  const id = `actor-${crypto.randomUUID()}`;
  window.localStorage.setItem(ACTOR_KEY, id);
  return id;
}

export function getActorLabel(actorId: string) {
  if (actorId === 'ai') return 'Patch! AI';
  const suffix = actorId.replace(/^actor-/, '').slice(-4).toUpperCase();
  return suffix ? `Patchsmith ${suffix}` : 'Patchsmith';
}
