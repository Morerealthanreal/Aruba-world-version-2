// Murals hidden on live. Placeholder paintings (drawn from simple shapes, not
// real photos) stay off until they are redone from photos, and famous-set
// copies of fair-set pictures stay off so one painting never covers two walls.
// Their walls fall back to the normal building texture.
export const MURAL_SKIP = new Set<string>([
  // Original San Nicolas set: placeholders (pilot hand-rebuilds enabled: night_watcher, lionfish, flamingos, nothing_to_declare)
  "prikichi", "pelican",
  "turtles", "iguana", "alice", "melting_pot",
  // Famous set: placeholders
  "saffron", "holambra",
  // Famous set: duplicates of fair-set pictures
  "bargestraat", "stuyvesant", "mo", "crazy", "emporium",
]);
