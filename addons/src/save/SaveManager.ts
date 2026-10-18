import type { SaveHooks, SaveState, Quality } from './types';
import { SCHEMA_VERSION, STORAGE_KEY } from './types';
import { decodeSave, encodeSave } from './codec.ts';

const AUTOSAVE_INTERVAL = 30;

export class SaveManager {
  private readonly hooks: SaveHooks;
  private paused = false;
  private autosaveTimer = 0;
  private overlay: HTMLDivElement | null = null;
  private settingsPanel: HTMLDivElement | null = null;
  private controlsPanel: HTMLDivElement | null = null;
  private currentQuality: Quality = 'high';
  private currentVolume = 0.8;
  private currentInvertY = false;
  private boundKey: ((e: KeyboardEvent) => void) | null = null;
  private touchPauseBtn: HTMLButtonElement | null = null;

  constructor(hooks: SaveHooks) {
    this.hooks = hooks;
    if (hooks.initialQuality) this.currentQuality = hooks.initialQuality;
    this.load();
    this.buildUI();
    this.bindInput();
  }

  get isPaused(): boolean { return this.paused; }

  update(dt: number): void {
    if (this.paused) return;
    this.autosaveTimer += dt;
    if (this.autosaveTimer >= AUTOSAVE_INTERVAL) {
      this.autosaveTimer = 0;
      this.save();
    }
  }

  save(): void {
    const raw = this.hooks.getState();
    const state: SaveState = {
      version: SCHEMA_VERSION,
      position: raw.position,
      vehicle: raw.vehicle,
      timeOfDay: raw.timeOfDay,
      quality: this.currentQuality,
      volume: this.currentVolume,
      invertY: this.currentInvertY,
    };
    try {
      localStorage.setItem(STORAGE_KEY, encodeSave(state));
    } catch {
      // quota or private mode — ignore
    }
  }

  load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state = decodeSave(raw);
      if (!state) return;
      this.currentQuality = state.quality;
      this.currentVolume = state.volume;
      this.currentInvertY = state.invertY;
      this.hooks.applyState(state);
      this.hooks.onQualityChange?.(state.quality);
      this.hooks.onVolumeChange?.(state.volume);
      this.hooks.onInvertYChange?.(state.invertY);
    } catch {
      // corrupt — ignore
    }
  }

  togglePause(): void {
    this.paused = !this.paused;
    this.hooks.setPaused(this.paused);
    if (this.overlay) {
      this.overlay.style.display = this.paused ? 'flex' : 'none';
    }
    if (this.paused) this.save();
  }

  private buildUI(): void {
    this.overlay = document.createElement('div');
    this.overlay.id = 'aw-pause';
    Object.assign(this.overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(8,12,18,0.82)',
      display: 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000',
      fontFamily: 'system-ui, sans-serif',
      color: '#e8e6e3',
      gap: '12px',
      touchAction: 'manipulation',
    });

    const title = document.createElement('div');
    title.textContent = 'PAUSED';
    title.style.fontSize = '28px';
    title.style.letterSpacing = '0.2em';
    title.style.marginBottom = '8px';
    this.overlay.appendChild(title);

    const mkBtn = (label: string, onClick: () => void): HTMLButtonElement => {
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style, {
        padding: '12px 28px',
        fontSize: '16px',
        background: '#1e2a36',
        color: '#e8e6e3',
        border: '1px solid #3a4a5a',
        borderRadius: '6px',
        cursor: 'pointer',
        minWidth: '180px',
        touchAction: 'manipulation',
      });
      b.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
      return b;
    };

    this.overlay.appendChild(mkBtn('Resume', () => this.togglePause()));
    this.overlay.appendChild(mkBtn('Settings', () => this.showSettings()));
    this.overlay.appendChild(mkBtn('Controls', () => this.showControls()));
    this.overlay.appendChild(mkBtn('Reset Position', () => {
      this.hooks.resetPosition();
      this.save();
    }));

    this.settingsPanel = this.buildSettingsPanel();
    this.controlsPanel = this.buildControlsPanel();
    this.overlay.appendChild(this.settingsPanel);
    this.overlay.appendChild(this.controlsPanel);

    document.body.appendChild(this.overlay);

    // Touch-friendly pause button (always visible)
    this.touchPauseBtn = document.createElement('button');
    this.touchPauseBtn.textContent = '⏸';
    Object.assign(this.touchPauseBtn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'rgba(20,28,36,0.7)',
      color: '#fff',
      border: '1px solid #4a5a6a',
      fontSize: '20px',
      zIndex: '9999',
      touchAction: 'manipulation',
      display: 'none',
    });
    this.touchPauseBtn.addEventListener('click', () => this.togglePause());
    document.body.appendChild(this.touchPauseBtn);

    // Show touch button on coarse pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      this.touchPauseBtn.style.display = 'block';
    }
  }

  private buildSettingsPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      display: 'none',
      flexDirection: 'column',
      gap: '10px',
      background: '#12181f',
      padding: '16px',
      borderRadius: '8px',
      minWidth: '240px',
    });

    const qLabel = document.createElement('div');
    qLabel.textContent = 'Quality';
    panel.appendChild(qLabel);
    const qSelect = document.createElement('select');
    (['low', 'medium', 'high'] as Quality[]).forEach((q) => {
      const opt = document.createElement('option');
      opt.value = q;
      opt.textContent = q.charAt(0).toUpperCase() + q.slice(1);
      if (q === this.currentQuality) opt.selected = true;
      qSelect.appendChild(opt);
    });
    qSelect.addEventListener('change', () => {
      this.currentQuality = qSelect.value as Quality;
      this.hooks.onQualityChange?.(this.currentQuality);
      this.save();
    });
    panel.appendChild(qSelect);

    const vLabel = document.createElement('div');
    vLabel.textContent = 'Volume';
    panel.appendChild(vLabel);
    const vSlider = document.createElement('input');
    vSlider.type = 'range';
    vSlider.min = '0';
    vSlider.max = '1';
    vSlider.step = '0.05';
    vSlider.value = String(this.currentVolume);
    vSlider.addEventListener('input', () => {
      this.currentVolume = parseFloat(vSlider.value);
      this.hooks.onVolumeChange?.(this.currentVolume);
    });
    vSlider.addEventListener('change', () => this.save());
    panel.appendChild(vSlider);

    const invLabel = document.createElement('label');
    invLabel.style.display = 'flex';
    invLabel.style.alignItems = 'center';
    invLabel.style.gap = '8px';
    const invCheck = document.createElement('input');
    invCheck.type = 'checkbox';
    invCheck.checked = this.currentInvertY;
    invCheck.addEventListener('change', () => {
      this.currentInvertY = invCheck.checked;
      this.hooks.onInvertYChange?.(this.currentInvertY);
      this.save();
    });
    invLabel.appendChild(invCheck);
    invLabel.appendChild(document.createTextNode('Invert Y'));
    panel.appendChild(invLabel);

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.style.marginTop = '8px';
    back.addEventListener('click', () => { panel.style.display = 'none'; });
    panel.appendChild(back);

    return panel;
  }

  private buildControlsPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      display: 'none',
      background: '#12181f',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '320px',
      fontSize: '14px',
      lineHeight: '1.5',
    });
    panel.innerHTML = `
      <div style="margin-bottom:8px;font-weight:600">Controls</div>
      <div>WASD / Arrows — Move</div>
      <div>Mouse / Drag — Look</div>
      <div>Shift — Sprint / Throttle</div>
      <div>Space — Jump / Interact</div>
      <div>E — Enter / Exit vehicle</div>
      <div>Esc / ⏸ — Pause</div>
      <div style="margin-top:8px">Touch: virtual sticks + pause button</div>
    `;
    const back = document.createElement('button');
    back.textContent = 'Back';
    back.style.marginTop = '12px';
    back.addEventListener('click', () => { panel.style.display = 'none'; });
    panel.appendChild(back);
    return panel;
  }

  private showSettings(): void {
    if (this.settingsPanel) this.settingsPanel.style.display = 'flex';
    if (this.controlsPanel) this.controlsPanel.style.display = 'none';
  }

  private showControls(): void {
    if (this.controlsPanel) this.controlsPanel.style.display = 'block';
    if (this.settingsPanel) this.settingsPanel.style.display = 'none';
  }

  private bindInput(): void {
    this.boundKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        this.togglePause();
        return;
      }
      // The game has no pause hook. Swallow movement keys so the world does not keep driving under the menu.
      if (this.paused) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', this.boundKey, true);
  }

  dispose(): void {
    if (this.boundKey) window.removeEventListener('keydown', this.boundKey, true);
    this.overlay?.remove();
    this.touchPauseBtn?.remove();
  }
}
