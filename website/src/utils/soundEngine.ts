/**
 * LABIB // SYNTHESIZED WEB AUDIO SOUND ENGINE
 * Uses HTML5 Web Audio API to produce crisp cyber sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('sec_ops_sfx');
    this.enabled = saved !== 'false';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('sec_ops_sfx', String(this.enabled));
    if (this.enabled) {
      this.play('click');
    }
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.05) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }

  public play(sound: 'click' | 'terminal_key' | 'success' | 'access_granted' | 'error' | 'alert') {
    if (!this.enabled) return;

    switch (sound) {
      case 'click':
        this.playTone(850, 0.04, 'square', 0.025);
        break;

      case 'terminal_key':
        this.playTone(600 + Math.random() * 250, 0.03, 'sine', 0.02);
        break;

      case 'success':
        this.playTone(523.25, 0.08, 'sine', 0.05); // C5
        setTimeout(() => this.playTone(659.25, 0.08, 'sine', 0.05), 90); // E5
        setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.05), 180); // G5
        break;

      case 'access_granted':
        this.playTone(440, 0.1, 'triangle', 0.07);
        setTimeout(() => this.playTone(880, 0.25, 'triangle', 0.08), 110);
        setTimeout(() => this.playTone(1320, 0.35, 'sine', 0.06), 240);
        break;

      case 'error':
        this.playTone(220, 0.12, 'sawtooth', 0.06);
        setTimeout(() => this.playTone(160, 0.18, 'sawtooth', 0.06), 120);
        break;

      case 'alert':
        this.playTone(900, 0.1, 'sawtooth', 0.04);
        setTimeout(() => this.playTone(700, 0.1, 'sawtooth', 0.04), 100);
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
