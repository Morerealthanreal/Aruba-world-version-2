// Quaternius heads are about a fifth of a 1.81 m body, which reads as a doll.
// Stretch the body up from the feet and shrink the head so the figure is a
// tall adult. Idle, Walk, and Run have no scale tracks, so this stays put.
// The root sits at the ground and the feet are parented to it, so they stay
// planted. Hats, sunglasses, and the face are children of the head, so they
// shrink with it.
import type { Object3D } from "three";

export function applyAdultProportions(root: Object3D, index: number) {
  // 1.20 body lift, head scaled by the inverse so the skull stays the same
  // world size and the legs, neck, and torso carry the extra height.
  const lift = 1.2 + (index % 4) * 0.015;
  root.scale.set(0.98, lift, 0.98);
  const head = root.getObjectByName("Head");
  if (head) head.scale.setScalar(1 / lift);
}
