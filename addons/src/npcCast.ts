// Twelve street people. Bodies are distinct CC0 meshes. Colours, hats,
// sunglasses, bags, and sandals follow refs/people/aruba-outfits.md.
// The photos are reference only and are not used as textures.
import type { CharacterPalette } from "./characters";

export type NpcHat = "none" | "straw" | "cap";

export type NpcCast = {
  id: number;
  name: string;
  /** 0 long trousers, 1 dress, 2 shorts. */
  kind: 0 | 1 | 2;
  face: number;
  cloth: number;
  height: number;
  breadth: number;
  hat: NpcHat;
  female: boolean;
  palette: CharacterPalette;
};

export const NPC_CAST: readonly NpcCast[] = [
  { id: 0, name: "Woman in a white blouse", kind: 0, face: 0, cloth: 0, height: 0.98, breadth: 0.99, hat: "straw", female: true,
    palette: { skin: 0xe8c39a, hair: 0x3a2418, top: 0xf7f3ea, bottom: 0xd8d0c2, dress: 0xf7f3ea } },
  { id: 1, name: "Woman in a yellow shirt", kind: 0, face: 1, cloth: 1, height: 0.99, breadth: 0.98, hat: "cap", female: true,
    palette: { skin: 0xc98b68, hair: 0x4a3428, top: 0xe6c84a, bottom: 0x2c4f86, dress: 0xe6c84a } },
  { id: 2, name: "Woman in a cream jacket", kind: 0, face: 2, cloth: 2, height: 1.02, breadth: 0.98, hat: "none", female: true,
    palette: { skin: 0xf3d2b4, hair: 0x8a5a32, top: 0xf3efe4, bottom: 0xd8d0c2, dress: 0xf3efe4 } },
  { id: 3, name: "Woman in a white shirt and shorts", kind: 2, face: 3, cloth: 3, height: 1.0, breadth: 0.99, hat: "straw", female: true,
    palette: { skin: 0x8d5a40, hair: 0x241816, top: 0xf7f4ee, bottom: 0xc4a574, dress: 0xf7f4ee } },
  { id: 4, name: "Woman in a coral top", kind: 0, face: 4, cloth: 4, height: 0.97, breadth: 1.0, hat: "cap", female: true,
    palette: { skin: 0xb98362, hair: 0x1a1412, top: 0xd96f56, bottom: 0x243044, dress: 0xd96f56 } },
  { id: 5, name: "Man in a pale shirt", kind: 0, face: 5, cloth: 5, height: 1.06, breadth: 1.04, hat: "cap", female: false,
    palette: { skin: 0x6e4634, hair: 0x1a1412, top: 0xf7f1e4, bottom: 0xc4a574, dress: 0xf7f1e4 } },
  { id: 6, name: "Young man in a blue hoodie", kind: 2, face: 6, cloth: 6, height: 1.04, breadth: 1.0, hat: "cap", female: false,
    palette: { skin: 0xd7a574, hair: 0x3a241c, top: 0x3e7ea8, bottom: 0x243044, dress: 0x3e7ea8 } },
  { id: 7, name: "Older man in a straw hat", kind: 0, face: 7, cloth: 7, height: 0.96, breadth: 1.05, hat: "straw", female: false,
    palette: { skin: 0xc4a07a, hair: 0x9a9690, top: 0x6e8f73, bottom: 0x5c4636, dress: 0x6e8f73 } },
  { id: 8, name: "Man in a white tee", kind: 0, face: 8, cloth: 8, height: 1.05, breadth: 1.0, hat: "none", female: false,
    palette: { skin: 0xa56b4c, hair: 0x6a2e24, top: 0xf7f4ee, bottom: 0x2c4f86, dress: 0xf7f4ee } },
  { id: 9, name: "Man in a light jacket", kind: 0, face: 9, cloth: 9, height: 1.08, breadth: 1.02, hat: "none", female: false,
    palette: { skin: 0xfff4e8, hair: 0xc4a15a, top: 0xe7e2d6, bottom: 0xcfc6b4, dress: 0xe7e2d6 } },
  { id: 10, name: "Older man in an ochre shirt", kind: 0, face: 10, cloth: 10, height: 0.97, breadth: 1.04, hat: "cap", female: false,
    palette: { skin: 0x9a6244, hair: 0x6e6a66, top: 0xe1c587, bottom: 0x4a372c, dress: 0xe1c587 } },
  { id: 11, name: "Man with a backpack", kind: 0, face: 11, cloth: 11, height: 1.07, breadth: 1.03, hat: "straw", female: false,
    palette: { skin: 0x6e4634, hair: 0x1a1412, top: 0x3e5c46, bottom: 0xc2b48a, dress: 0x3e5c46 } },
];
