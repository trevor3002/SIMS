/**
 * Web Audio API Procedural Sound Synthesizer
 * Zero external mp3 dependencies - 100% synthesized sound effects & cozy lofi music
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private oceanSource: AudioBufferSourceNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGain && this.sfxGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(muted ? 0 : 0.2, t);
      this.sfxGain.gain.setValueAtTime(muted ? 0 : 0.4, t);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // UI button click / tap
  public playClick(pitch: number = 440) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio context error fallback
    }
  }

  // Simlish voice banter (procedural gibberish syllables using formant frequency chirps)
  public playSimlish(mood: 'happy' | 'flirty' | 'serious' | 'laugh' = 'happy') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const baseFreq = mood === 'flirty' ? 480 : mood === 'laugh' ? 540 : 380;
      const syllables = mood === 'laugh' ? 4 : Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < syllables; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + i * 0.09;
        const dur = 0.08;

        osc.type = 'triangle';
        const pitchJump = (Math.random() - 0.5) * 160;
        osc.frequency.setValueAtTime(baseFreq + pitchJump, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + pitchJump + (Math.random() > 0.5 ? 80 : -60), now + dur);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + dur);
      }
    } catch {
      // ignore
    }
  }

  // Cash / Money chime (high sparkling arpeggio)
  public playCashRegister() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [659.25, 783.99, 1046.50, 1318.51]; // E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // Romantic heart chime / harp sweep
  public playRomanceChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // Need restored / success ping
  public playNeedRestored() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.18);
      });
    } catch {
      // ignore
    }
  }

  // Footstep sound for character walk
  public playFootstep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // Cozy procedural Lofi background music
  public startAmbientMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    try {
      this.initContext();
    } catch {
      return;
    }

    // Progression of relaxing jazzy chords: Cmaj7, Am7, Dm7, G7sus
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // C, E, G, B
      [220.00, 261.63, 329.63, 392.00], // A, C, E, G
      [293.66, 349.23, 440.00, 523.25], // D, F, A, C
      [196.00, 261.63, 293.66, 392.00], // G, C, D, G
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx || !this.musicGain) return;
      try {
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];
        chordIdx++;

        currentChord.forEach((freq, i) => {
          if (!this.ctx || !this.musicGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq * 0.5, now); // warm lower register

          const noteDuration = 2.4;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.05, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

          osc.connect(gain);
          gain.connect(this.musicGain);

          osc.start(now);
          osc.stop(now + noteDuration);
        });
      } catch {
        // ignore
      }
    };

    // Play first chord right away
    playChord();
    this.musicIntervalId = window.setInterval(playChord, 2800);
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }
}

export const sound = new SoundSynthesizer();
