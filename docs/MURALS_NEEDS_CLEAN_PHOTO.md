# Murals needing a cleaner reference photo

Rule: if a mural cannot be made clean with **homography + small crop** only, it stays in `MURAL_SKIP`.

## Deferred from rectify pilot (inpaint not acceptable)

| ID | Why |
|----|-----|
| `flamingos` | Corner wrap, multiple windows, lamp post; SAC photo too obstructed |
| `nothing_to_declare` | Person, beam/wire, corner box; no single clean SAC frame with full P.A.N. oval |

## Skip list — assessed for homography-only (this pass)

| ID | SAC / ref | Verdict |
|----|-----------|---------|
| `prikichi` | 13080 | **Hidden** — street clutter, partial wall angle |
| `pelican` | 13079 | **Hidden** — windows, poles, busy foreground |
| `turtles` | 13083 | **Hidden** — windows in painted field |
| `iguana` | 13085 | **Hidden** — long wall, cars, perspective |
| `alice` | 13092 | **Hidden** — façade obstructions, tight angle |
| `melting_pot` | Wikimedia | **Hidden** — low wall, people/cars in frame |
| `saffron` | famous set | **Hidden** — placeholder / fair duplicate |
| `holambra` | famous set | **Hidden** — placeholder |
| `bargestraat` | 13077 | **Hidden** — fair duplicate photo |
| `stuyvesant` | 13084 | **Hidden** — needs dedicated shoot (was wrong ref) |
| `mo` | 13090 | **Hidden** — busy street, partial wall |
| `crazy` | 13072 | **Hidden** — needs dedicated shoot (was wrong ref) |
| `emporium` | 13087 | **Hidden** — duplicate / obstructed fair ref |

## Live via homography (PR #135)

| ID | Ref |
|----|-----|
| `night_watcher` | `refs/murals/night_watcher/` SAC 13073 |
| `lionfish` | `refs/murals/lionfish/` SAC 13093 — pass-2 window inpaint + **top crop** above dorsal fins (no top/sky inpaint) |
