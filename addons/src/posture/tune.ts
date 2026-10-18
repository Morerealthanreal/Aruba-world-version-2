// Fortnite-style unarmed idle / walk / run. Radians and metres.
// Off unless ?fnposture=1. No jump, no climb.

export const deg = (d: number) => (d * Math.PI) / 180;

export const TUNE = {
  /** Leg length is measured from the rig; these are fractions of that length. */
  walkStride: 0.8,
  runStride: 1.1,
  /** Steps per second at the nominal gait (a step is one footfall). */
  walkCadence: 1.9,
  runCadence: 3.15,
  /** Speed bands for the player blend when the flag is on.
   *  The real-island walk is 1.9 m/s and the run is 6.1 m/s. */
  idleCut: 0.22,
  walkAt: 2.2,
  runAt: 5.4,
  /** Whole-body lean from the ankles. Spine, neck and head stay straight along this axis. */
  idleLean: deg(0),
  walkLean: deg(1.2),
  runLean: deg(11),
  /** Chest stays gently open while idle; the run does not hunch. */
  idleChest: deg(4),
  walkChest: deg(1),
  runChest: deg(0),
  /** Vertical travel of the hips, peak to peak, one bounce per footfall. */
  idleBob: 0.008,
  walkBob: 0.03,
  runBob: 0.07,
  /** Arm swing measured from the torso's down-axis. Walk shoulders, run pump. */
  walkSwing: deg(28),
  runSwing: deg(52),
  walkElbow: deg(20),
  runElbow: deg(90),
  idleElbow: deg(18),
  /** Shoulder yaw against the hips. */
  walkCounter: deg(8),
  runCounter: deg(14),
  /** Hip roll. Idle weight shift uses its own period. */
  walkSway: deg(3.5),
  runSway: deg(2.5),
  idleSway: deg(2.2),
  idleSwayPeriod: 3,
  breathHz: 0.28,
  breathAmp: deg(1.3),
  /** Stance fraction of the two-step cycle. Left starts at phase 0; right is half a cycle later. */
  walkDuty: 0.36,
  runDuty: 0.2,
  /** Lateral foot rails, metres. Walk is two lines; run is nearly one line. */
  walkRail: 0.06,
  runRail: 0.02,
  /** Ankle height above the ground when the sole is planted, metres at scale 1. */
  ankle: 0.07,
  /** Heel-toe pitch. Positive lifts the toes (heel strike). */
  walkHeel: deg(16),
  walkToe: deg(-26),
  runFore: deg(-10),
  /** Extra thigh lift above the clip during the run's swing, capped. */
  runKnee: deg(45),
  /** 90% of a speed change settles in this many seconds. */
  accelBlend: 0.15,
  stopBlend: 0.2,
  /** Turn bank. Full bank (between these) at this yaw rate. */
  bankMin: deg(4),
  bankMax: deg(7.6),
  bankYawRate: 2.2,
  stopOvershoot: deg(5),
  /** Camera follow drops the step bob. Long enough that a 3 Hz bounce is nearly gone. */
  cameraTau: 0.55,
  /** Calf length along local +Y at scale 1. The foot is not a child of the calf. */
  calfLen: 0.4129,
} as const;
