// Murals hidden until a verified photo supports homography + small crop only (no inpaint-heavy fixes).
// See docs/MURALS_NEEDS_CLEAN_PHOTO.md and refs/murals/<id>/SOURCES.md.
export const MURAL_SKIP = new Set<string>([
  // Rectify pilot: deferred (need cleaner reference photos)
  "flamingos",
  "nothing_to_declare",
  "lionfish",
  // Original San Nicolas set: placeholders / obstructed refs
  "prikichi",
  "pelican",
  "turtles",
  "iguana",
  "alice",
  "melting_pot",
  // Famous set: placeholders
  "saffron",
  "holambra",
  // Famous set: duplicates or wrong legacy refs
  "bargestraat",
  "stuyvesant",
  "mo",
  "crazy",
  "emporium",
]);
