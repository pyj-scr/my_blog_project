/* =====================================================
   audio.js - Web Audio API Sound Manager
   All sounds are generated procedurally (no files needed)
   ===================================================== */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.vibrationEnabled = true;
  }

  /** Initialize AudioContext (must be called after user gesture) */
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play a single oscillator tone.
   * @param {number} freq     Frequency in Hz
   * @param {number} duration Duration in seconds
   * @param {string} type     Oscillator type
   * @param {number} volume   Gain (0-1)
   * @param {number} delay    Start delay in seconds
   */
  _tone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
    if (!this.sfxEnabled || !this.ctx) return;

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  /** Card select click */
  playSelect() {
    this._tone(700, 0.08, 'sine', 0.2);
  }

  /** Card deselect */
  playDeselect() {
    this._tone(350, 0.06, 'sine', 0.12);
  }

  /** 4-card match success - ascending arpeggio */
  playMatch() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      this._tone(f, 0.18, 'sine', 0.22, i * 0.07);
    });
  }

  /** Match fail - short descending buzz */
  playFail() {
    this._tone(220, 0.25, 'square', 0.12);
    this._tone(165, 0.25, 'square', 0.1, 0.12);
  }

  /** Stage clear fanfare */
  playStageClear() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => {
      this._tone(f, 0.22, 'sine', 0.25, i * 0.11);
    });
  }

  /** UI button click */
  playClick() {
    this._tone(880, 0.04, 'sine', 0.12);
  }

  /** Bonus star collect */
  playBonus() {
    const notes = [880, 1100, 1320, 1760];
    notes.forEach((f, i) => {
      this._tone(f, 0.12, 'sine', 0.18, i * 0.05);
    });
  }

  /** Haptic feedback */
  vibrate(pattern = [50]) {
    if (this.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}

// Global singleton
const audio = new AudioManager();
