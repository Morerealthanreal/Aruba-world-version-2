// Full-screen underwater tint (SuperGrok FIX 6). A fixed DOM overlay, so it costs nothing on the GPU and
// is identical on Low. Shown only while the camera is below the surface; deeper = darker blue.
export class UnderwaterTint {
  private readonly overlay: HTMLDivElement;
  private active = false;
  private lastKey = -1;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'awUnderwater';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      background: 'rgba(10, 80, 120, 0.45)',
      // plain alpha blend (multiply over the WebGL canvas was invisible on some compositors); above the
      // canvas, below A's HUD (z-index 8+) so the controls stay readable
      zIndex: '5',
      display: 'none',
      transition: 'opacity 0.15s linear',
    });
    document.body.appendChild(this.overlay);
  }

  get visible(): boolean { return this.active; }

  setUnderwater(under: boolean, depth: number): void {
    if (!under) {
      if (this.active) {
        this.active = false;
        this.lastKey = -1;
        this.overlay.style.display = 'none';
      }
      return;
    }
    this.active = true;
    const t = Math.min(1, depth / 4);
    // only touch the DOM when the shade visibly changes (20 steps over 4 m)
    const key = Math.round(t * 20);
    if (key === this.lastKey) return;
    this.lastKey = key;
    const k = key / 20;
    this.overlay.style.display = 'block';
    this.overlay.style.opacity = String(0.75 + k * 0.25);
    this.overlay.style.background = `rgba(${Math.round(8 + k * 12)}, ${Math.round(60 + k * 40)}, ${Math.round(110 + k * 30)}, ${(0.45 + k * 0.3).toFixed(2)})`;
  }

  dispose(): void {
    this.overlay.remove();
  }
}
