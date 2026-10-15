# Arcade motorcycle controls

The motorcycle pass is tuned for direct, forgiving phone play:

- Left/right buttons steer with speed-sensitive lean.
- GAS has a strong launch and a progressive high-speed pull.
- BRAKE plus either steering button enters a controlled drift above about 32 km/h.
- Hold WHEELIE (or `V`) above about 10 km/h.
- The chase camera tightens in portrait, widens its FOV with speed, and adds restrained road/bump motion.
- Rear-wheel skid marks and smoke appear under hard braking and while drifting.

Keyboard remains `W`/up for gas, `Space` for brake, `A`/`D` or left/right for steering,
`V` for wheelie, and `C` to cycle chase cameras.

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

The resulting targets are an approximately 42 m/s sustained maximum, a roughly 3–4 second
run to 28 m/s, 14–17 m/s² total straight-line braking, 60–70% speed retention through a
one-second drift, a 40° lean clamp, and a 6–7.5 m portrait chase distance. These are
evidence-informed arcade targets rather than claimed measurements from the original game.

All controls and graphics in Aruba World use the project's own generic labels and styling.
