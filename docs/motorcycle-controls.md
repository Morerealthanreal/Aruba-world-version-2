# Arcade motorcycle controls

The motorcycle pass is tuned for direct, forgiving phone play:

- Left/right buttons steer with speed-sensitive lean.
- GAS has the reference clip's strong launch and a progressive pull toward roughly 200 km/h.
- BRAKE plus either steering button enters a controlled drift above about 32 km/h.
- The chase camera sits low and close, widens its FOV slightly with speed, and adds restrained road/bump motion.
- Rear-wheel skid marks and smoke appear under hard braking and while drifting.

Keyboard remains `W`/up for gas, `Space` for brake, `A`/`D` or left/right for steering,
and `C` to cycle chase cameras. There is deliberately no dedicated wheelie control.

Use `?gvmoto=0` to restore the original motorcycle handling and presentation. The legacy
`?gv=0` flag remains supported. `?addons=0` disables all add-ons.

## Public control references

The behavior is based on publicly documented arcade-bike conventions from Gangstar Vegas,
not on copied art or branding:

- [Gameloft help: control schemes and sensitivity](https://gameloft.helpshift.com/hc/en/26-gangstar-vegas/faq/1534-how-can-i-change-the-control-scheme-or-sensitivity/)
- [Community control guide: arrow steering, pedal throttle, brake-plus-steer drift, and bike stunts](http://mymobilegamelife.blogspot.com/2015/01/tips-about-control-in-gangstar-vegas.html)
- [Gameplay: acceleration and portrait bike HUD, 4:08–5:25](https://www.dailymotion.com/video/x5xvkkd?start=248)
- [Gameplay: pronounced 30–40° cornering lean, 7:58–8:18](https://www.dailymotion.com/video/x5xvkkd?start=478)
- [Gameplay: forgiving tight turn and persistent skid marks, 7:45–7:58](https://www.dailymotion.com/video/x5xv8m0?start=465)

The supplied 3:26–4:50 ride clip is the primary reference. The resulting targets are a
roughly 1–2 second launch to road speed, a 55 m/s cap, strong 1–2 second braking from high
speed, controlled drift speed retention, a 40–45° lean clamp, and a 4–5 m portrait chase
distance. These are evidence-informed arcade targets rather than claimed measurements from
the original game.

## Motorcycle model

`game/models/moto.glb` is a decimated, recolored copy of **Sports Bike** by
[appsnation](https://sketchfab.com/appsnation.co)
([model](https://sketchfab.com/3d-models/sports-bike-a80259b859c842d5824c25c61e0fc421),
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)). Manufacturer logos and
decal textures were removed and the red paint was unified. `npm run model:moto` no
longer overwrites this file with the old procedural shell.

It is a faired sport bike, not a Panigale. The licensed file has a one-piece fairing,
twin slim headlights, an integrated windscreen, stalk mirrors and gold forks. It also
has a dual swingarm, a chain and low twin exhausts, and the wheels are red five-spoke
rather than black. No CC0 or CC-BY Panigale with a single-sided swingarm and under-seat
exhausts was actually downloadable.

The rider is a posed, baked copy of **Sam** from the Innerscene locomotion collection,
adapted from a MakeHuman / MPFB character and released
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
([source](https://www.innerscene.com/tools/library/3d-parts/locomotion-collection-sam-3d-person-animated-dc23800f)).
Hair, street clothes and the head are not shown. The body wears black leathers with red
chest and shoulder panels, black gloves and black boots, and sits in a tucked sport
position with the hands on the grips and the feet on the pegs. The full-face helmet,
dark visor, glove shells and boot shafts are modelled for this project. `sport_rider`
is about 6,300 triangles and `sport_rider_far` about 2,900, and both are children of the
same leaning group as the bike.

The near group `sport_bike` is about 20,000 triangles. `sport_bike_far` is about 4,000
triangles, hidden at load and shown past about 18 m. Both wheels sit on y = 0 with the
axles on the existing wheelbase (front z = -0.72, rear z = 0.75). Handling, lean, skid
marks and the lack of a wheelie are unchanged.

All controls and graphics in Aruba World use the project's own generic labels and styling.
