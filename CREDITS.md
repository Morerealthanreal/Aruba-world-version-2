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

## Pedestrian character meshes

Maya and Sam, and the painted near-LOD faces, are documented in
`game/models/pedestrians-CC0.txt`. Those bodies and the fallback clips still
in the LOD files are Innerscene / MakeHuman derivatives under CC0. The live
crowd plays `locomotion.glb` instead of the simplified fallback gait.
