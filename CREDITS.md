# Credits

## Pedestrian and player locomotion

The on-foot walk, run, and idle cycles in `game/models/locomotion.glb` are
retargeted from the Quaternius Universal Animation Library.

- Author: Quaternius
- Licence: [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
- Pack: <https://quaternius.com/packs/universalanimationlibrary.html>
- Godot glTF mirror used for the retarget: <https://github.com/J-Ponzo/gltf-universal-animation-library>

Clips used: `Idle_Loop`, `Walk_Loop`, and `Jog_Fwd_Loop`. They were retargeted
onto the existing MakeHuman / MPFB skeleton (pelvis, spine, clavicles, arms,
legs, feet, and toes). The character meshes are not Quaternius models.

`tools/retarget-locomotion.mjs` regenerates the file. It reads the Godot
library (`lib.gltf` + `lib.bin`) and `game/models/player_sam.glb`.

## Street crowd

The twelve people on the street are CC0 characters from Quaternius Ultimate
Modular Women and Ultimate Modular Men. Each one keeps that mesh, that
skeleton, and the pack's Idle, Walk, and Run. Outfit notes, including the
free Aruba photos used only as clothing reference, are in
`refs/people/aruba-outfits.md`. No photo is used as a texture.

The on-foot player still uses `locomotion.glb`.
