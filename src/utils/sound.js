// src/utils/sound.js

let sharedAudioCtx = null;
const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedAudioCtx;
};

export const playSound = (type, enabled = true) => {
  if (!enabled) return;
  
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'install') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.15);
  }
};

class MusicPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.interval = null;
    this.buffer = null;
    this.source = null;
    this.gainNode = null;
    this.sessionToken = 0;
    this.customMusicChecked = false;
  }

  init() {
    this.audioCtx = getAudioContext();
  }

  async loadCustomMusic() {
    if (this.buffer) return true;
    if (this.customMusicChecked) return false;
    try {
      const response = await fetch('/music.mp3');
      if (!response.ok) { this.customMusicChecked = true; return false; }
      const arrayBuffer = await response.arrayBuffer();
      this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      return true;
    } catch (error) {
      console.error("Error loading custom music:", error);
      this.customMusicChecked = true;
      return false;
    }
  }

  playCustomTrack() {
    if (!this.isPlaying || !this.buffer) return;

    const ctx = this.audioCtx;
    this.source = ctx.createBufferSource();
    this.source.buffer = this.buffer;
    
    this.gainNode = ctx.createGain();
    this.source.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    const duration = this.buffer.duration;
    const fadeTime = 2.5; // Seconds to fade in/out

    // Fade In
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(0.3, now + fadeTime);

    // Fade Out at the end to make non-loopable tracks sound better
    if (duration > fadeTime * 2) {
      this.gainNode.gain.setValueAtTime(0.3, now + duration - fadeTime);
      this.gainNode.gain.linearRampToValueAtTime(0, now + duration);
    }

    this.source.start(now);
    
    this.source.onended = () => {
      if (this.isPlaying) {
        this.playCustomTrack(); // Loop
      }
    };
  }

  playAmbientNote() {
    if (!this.isPlaying || !this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    // Pentatonic scale frequencies for a pleasant ambient sound
    const notes = [196.00, 261.63, 293.66, 329.63, 392.00, 523.25];
    const note = notes[Math.floor(Math.random() * notes.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    const duration = 3;

    // Smooth envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.02, now + 1);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  toggle(enabled) {
    if (enabled) {
      this.init();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.sessionToken++;
        const currentToken = this.sessionToken;

        // Start ambient immediately to avoid silence while checking for custom music
        let startedAmbient = false;
        if (!this.buffer) {
          this.playAmbientNote();
          this.interval = setInterval(() => this.playAmbientNote(), 2500);
          startedAmbient = true;
        }

        // Try to load custom music first
        this.loadCustomMusic().then(hasCustom => {
          if (!this.isPlaying || this.sessionToken !== currentToken) return;

          if (hasCustom) {
            if (startedAmbient) {
              clearInterval(this.interval);
              this.interval = null;
            }
            this.playCustomTrack();
          } else {
            // Fallback to ambient
            if (!startedAmbient) {
              this.playAmbientNote();
              this.interval = setInterval(() => this.playAmbientNote(), 2500);
            }
          }
        });
      }
    } else {
      this.isPlaying = false;
      this.sessionToken++; // Invalidate pending loads

      if (this.source) {
        try {
          const now = this.audioCtx.currentTime;
          if (this.gainNode) {
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
          }
          this.source.stop(now + 0.5);
        } catch (error) {
            console.error("Error stopping music source:", error);
        }
        this.source = null;
      }

      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }
}

export const musicPlayer = new MusicPlayer();