# NPC handoff — bc-1f8e471f

Agent A5 owns NPCs only: peds, crowds, kids, characters, NPC visuals. Hotels, places, and core gameplay belong to the other agent. Do not self-merge. Do not raise soak gates. Everyone stays fully clothed, no sheer clothing. PR base is main. High and Low must both pass. Never print secrets and spend nothing.

Main is `ca7b2142` "Add crowds at Eagle Beach and Oranjestad (#201)". That squash is the geometry-hold fix from branch `cursor/npc-crowd-eagle-oranjestad-4fc1` at `33bc0f8d`. Both lanes were green before merge.

#222 is closed on purpose. The talk pose already lives in #217. Do not reopen it.

## Do this next

1. Watch #213 Low on `b793ee09`. High already passed. Low was still running when this note was written. The previous head `da959af1` failed Low only: textures **5 vs limit 4**. Geometry was inside the budget (renderer **52.5**, scene **68**, limit scene+12 = 80). One attempt also hit the 10-minute soak timeout and closed the page. `b793ee09` is an empty retry of that soak. If Low passes, #213 is ready to merge. It is already `MERGEABLE` / conflict-free against `ca7b214`.
2. After #213 squash-merges, rebase the stack **one PR at a time** onto the new main, get each green, and say it is ready before starting the next. Order: **#216, #218, #219, #221, #215, #220, #217, #223, #224**.
3. Those branches are still the old stack on top of pre-#201 #213 (`659b32af`). They are green on that old tree and will conflict with current main. Do not rebase them until #213 has merged.

## Open PRs

| PR | Branch | Head | High | Low | Mergeable on current main |
|---|---|---|---|---|---|
| #213 | `cursor/npc-gangstar-closeup-b7f9` | `b793ee09285e441610c11cc37a56d31e07fb25a1` | SUCCESS | IN PROGRESS (retry) | yes, waiting on Low |
| #216 | `cursor/npc-adult-proportions-8c12` | `9680a8497bfea3cef5bdd9c21f2f3d1550aa4e70` | SUCCESS | SUCCESS | no, needs rebase after #213 |
| #218 | `cursor/npc-face-sunglasses-8c12` | `aea1bae2690ff531f2c2b5bef0cd8f7fec3c7ee8` | SUCCESS | SUCCESS | no |
| #219 | `cursor/npc-skin-cloth-8c12` | `9c1e8a62b69ce3d62028497fa43f975e9672d9a0` | SUCCESS | SUCCESS | no |
| #221 | `cursor/npc-hair-volume-8c12` | `17f1205af87fde1708407da5085bfd068c202a8c` | SUCCESS | SUCCESS | no |
| #215 | `cursor/npc-gold-cross-8c12` | `2e207128359a8b5f04f90c1e382a1fe21f00708f` | SUCCESS | SUCCESS | no |
| #220 | `cursor/npc-phone-idle-8c12` | `4bc6e8a680aded67f99cc34ac6bc2bbc4077d359` | SUCCESS | SUCCESS | no |
| #217 | `cursor/npc-towel-idle-8c12` | `ec6ad0acdbb7fed67cfb8a4d288239e0cf3e21fe` | SUCCESS | SUCCESS | no |
| #223 | `cursor/npc-body-variety-8c12` | `a5549ca0078b8dc29dae95e5c0cab5ab715567fe` | SUCCESS | SUCCESS | no |
| #224 | `cursor/npc-hotel-crowds-8c12` | `b27ebca4ffe0f1b84230c614e4c699b95ccb3f77` | SUCCESS | SUCCESS | no |

Closed this run: #222 `cursor/npc-talk-idle-8c12` `293c9b63b7`. High SUCCESS. Low failed three times on different near-misses (geometry 57.5 vs 54, geometry 21 vs 14, textures 5.5 vs 4), two of them also timing out. The pose is in #217.

Merged: #201 `33bc0f8d` → main `ca7b2142`. #200 is already in that history (`5d552a20`).

## #213 rebase (done, pushed)

Rebased `cursor/npc-gangstar-closeup-b7f9` onto `ca7b2142`. Tip parents:

- `b793ee09` empty Low retry
- `da959af1` Palm Beach board
- `0198b8c9` close-up (hair, cross, belt)
- `5967e976` sunglasses
- `2d2842da` adult proportions

Only source delta vs main: `npcBake.ts`, `npcHats.ts`, `npcOil.ts`, new `npcProportions.ts`, and three lines in `pedestrians.ts` (`applyAdultProportions`, root stays visible). Board blob must stay `3d12bd758a2fd97bc1f52d13e3aa81875c0fcb88` (`refs/places/palm-beach/crowd/compare.jpg`, 104155 bytes).

Conflict on the first commit was `pedestrians.ts`: keep `root.visible = true` from #201 **and** call `applyAdultProportions(root, i)`. Do not go back to `root.visible = false` or the uniform `scale.setScalar`. Bundle conflicts: `git checkout --ours game/addons/aw-addons.js` (ours is main during rebase) then `npm --prefix addons run build`. Board conflicts: `git checkout --theirs` so the PR keeps its own `compare.jpg`.

## Boards (keep each PR's blob on rebase)

| PR | `compare.jpg` git blob |
|---|---|
| #213 | `3d12bd758a2fd97bc1f52d13e3aa81875c0fcb88` |
| #216 | `20f81dff653c142b1d2b8d314595bacccb6930da` |
| #218 | `9e078da24d3323e762ce8c833c4e06d536c9ab97` |
| #219 | `a5f8e9c9d7130a70ba716d8a39b0a79f0d09d984` |
| #221 | `85af0e3ea4c661df029b82d65e855dfc24dc08e3` |
| #215 | `def25e864a61a59465b9688bbfd140a881a70a55` |
| #220 | `1549c000f263c102d73c0a772d512df12c7ad4a6` |
| #217 | `9606e082e47dc2d6884c71b8ab9b0e1347206317` |
| #223 | `14608f59cb7e85220ccf9139acdd6bc921e78727` |
| #224 | `792812890e564b61c81bc5a7c78dab5a9ded1b70` |

#216, #218, #219, #221, and #215 are board-only on the old #213. Proportions, sunglasses, skin, hair, and the cross are already in #213's close-up commits. After #213 merges, rebasing those five should only keep the jpg. #220 (phone), #217 (towel, and the talk pose), #223 (body variety), and #224 (hotel guests) are real feature commits.

## What #201 fixed (do not undo)

Renderer growth 67.5 vs limit 53.5 on #201 was real. The Eagle/Oranjestad slots reuse the same 6-rig pool and the same kid pool. Hiding `root.visible` made `uploadSceneGeometries` skip the meshes (it forces mesh visibility but not parent visibility). Those geometries were already in the scene, so the first real draw on a later lap raised `renderer.info.memory.geometries` without scene growth. A region unload could also `dispose()` the buffers.

Fix, now on main:

- Pool is built once. SkeletonUtils clones share body geometry. Hats, face, hair, belt, sunglasses are cached in `npcHats.ts`.
- `holdGeometry()` in `npcBake.ts` no-ops `dispose` on pool buffers.
- Rig and kid **roots stay visible**. Show and hide the mesh parts. Kids follow `rig.shown`, not `root.visible`.
- Prime still draws the pool in a temp scene, and repeats a few times after boot. `renderBufferDirect` did **not** upload these skinned meshes. The temp-scene render did.
- Distant beach slots stay frozen outside `radius + 180`. Walkers replant only after an 8 m step.

Local check after the fix: crowd unique geos stayed 23, kids 28, `geo.dispose()` on a pool geometry dropped the renderer count by 0, and the Noord teleport no longer collapsed the renderer count (about 4608 → 4601). Forcing the camera onto an Oranjestad slot showed 6 rigs and 1 kid.

## Soak

`tests/long-drive-soak.spec.js`, project `low` only, viewport 412×915, `/?q=low&emerg=force&crash=force&crashx=10`. Route: oranjestad, noord, california, hooiberg, san-nicolas, baby-beach. Defaults: 3 warmup + 2 measure, 7 s drive, 2 s settle. Gates: heap ≤ 24 MB, texture growth ≤ 4, renderer geometry ≤ max(0, scene geometry growth) + 12, scene geometry ≤ 100, scene objects ≤ 300. Do not raise them.

#213 Low failure on `da959af1`, run `39338740152`, artifact `aruba-world-low-browser-artifacts`, file `.../low-retry1/soak-metrics.json`:

- textures median c3 897 → c4 902, **delta 5**, limit 4. This is the failure.
- geometries 5375 → 5427.5, delta 52.5. Scene geometries 7355 → 7423, delta 68. Geometry passed.
- Textures moved up and down per stop (c4 noord 910, hooiberg 889, baby-beach 911). Not a monotonic NPC texture leak. The close-up adds no maps. It is vertex colors plus an `awKind` attribute on the shared oil shader (`customProgramCacheKey` `aw-oil-light-v7`).
- If the retry also fails at +5, do not raise the gate. Look for a texture that first uploads on the measured lap. Kid GLB maps are `initTexture`'d in `kids.ts` prime. Crowd source maps are released in `bakePerson`.

Oranjestad slots are anchorX `-7360`, z about 152–208. The soak road is about 51 m away and the low crowd radius is 46 m, so the crowd often stays hidden. Noord beach is about 1.5 km from the "noord" soak stop. Short local probes are not comparable to CI.

`familySize`: low tier has 2 ambient peds, keys 1 and 2, both size 0. Crowd rig index 5 (key 505) is the one that wants a child. That is expected with the stable hash, not a missing pool.

## Rebase mechanics

- Worktree used for #213: `/tmp/aw-213` on `cursor/npc-gangstar-closeup-b7f9`. `addons/node_modules` there is an untracked symlink to `/workspace/addons/node_modules`. **Never `git add -A` in that worktree.** It was committed once as a symlink and removed again in `5967e976`.
- Visual stack worktree: `/tmp/aw-vis`, last left on `cursor/npc-hotel-crowds-8c12` at `b27ebca4`.
- During rebase, rebuild the bundle after every conflict. `npm --prefix addons run build` writes `game/addons/aw-addons.js`.
- Force-push rebased PR branches with `--force-with-lease`. Do not create new branch names for these existing PRs.
- #224 slot type has a single `anchorX`. An earlier duplicate `anchorX` field was type-only and is already gone in `b27ebca4`. Hotel guests use `inland === 0` plus `anchorX`. Do not move hotel geometry; that is the other agent's world. The NPC planter/guest code in #224 is in scope.

## Gotchas

- Soak upload does not draw children of a hidden parent. Keeping pool roots visible is load-bearing.
- `holdGeometry` must stay on crowd and kid buffers. A later rebase that restores `root.visible = false` reopens the 67.5 leak.
- Empty Low retries are appropriate for a timeout or a 1-texture median wobble. They are not appropriate for a repeated geometry excess on the same number. #201's 67.5 was the latter.
- #219 and #215 failed once on the old stack (timeout / geometry noise) and went green on a retry. Their code matches neighboring green SHAs. #222 did not, which is why it was closed instead of retried forever.
- Gangstar reference (red hair, tank, denim shorts, sunglasses) is a look target only. Never copy those assets.
- Low caps: crowd 6 / radius 46 m, kids 3. Med 9 / 64 / 8. High 12 / 80 / 14. Families are about 40% with 1 or 2 kids, island-wide, one shared pool.
