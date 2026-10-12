// Shared shader uniforms (B: src/game/look/time.ts). One write updates every patched material.
export const uNight = { value: 0 };
export const uTime = { value: 0 };
/** 0 until full dusk (sun ~11 deg below horizon), then 1: stars wait for real darkness. */
export const uStars = { value: 0 };
