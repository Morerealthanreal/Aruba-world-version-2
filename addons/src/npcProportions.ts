// Quaternius heads are about a fifth of a 1.81 m body, which reads as a doll.
// Stretch the body up from the feet and shrink the head so the figure is a
// tall adult. Idle, Walk, and Run have no scale tracks, so this stays put.
// The root sits at the ground and the feet are parented to it, so they stay
// planted. Hats, sunglasses, and the face are children of the head, so they
// shrink with it.
import type { Object3D } from "three";

export function applyAdultProportions(root: Object3D, index: number, older = false) {
  // Average, tall-and-narrow, or broad. Older adults are a bit shorter and
  // wider. The head scale cancels the height so the skull stays put.
  const body = index % 3;
  let lift = body === 1 ? 1.26 : body === 2 ? 1.14 : 1.2;
  let xz = body === 1 ? 0.92 : body === 2 ? 1.08 : 0.98;
  if (older) {
    lift = 1.06;
    xz = 1.06;
  }
  root.scale.set(xz, lift, xz);
  const head = root.getObjectByName("Head");
  if (head) head.scale.setScalar(1 / lift);
}
