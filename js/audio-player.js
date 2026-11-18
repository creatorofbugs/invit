/**
 * Royal Background Music & Audio Controller
 * Features a luxurious floating music toggle with pulsing audio visualizer rings,
 * supports both custom MP3 audio files and a built-in Web Audio API royal sitar/flute
 * Indian Classical Raag synth engine so music works instantly offline anywhere!
 */

class RoyalAudioPlayer {
  constructor() {
    this.audioBtn = document.getElementById('music-toggle-btn');
    this.audioIcon = document.getElementById('music-icon');
    this.soundWaves = document.getElementById('sound-waves');
    this.customAudio = document.getElementById('bg-music-audio');
    this.isPlaying = false;
    this.synthContext = null;
    this.synthNodes = [];
    this.timerId = null;
    this.userInteracted = false;

    this.init();
  }

  init() {
    if (!this.audioBtn) return;

    this.audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlay();
    });

    // Handle browser autoplay policy: Start on first user interaction if desirable
    const onFirstInteraction = () => {
      if (!this.userInteracted) {
        this.userInteracted = true;
        // Don't force sound immediately without consent, but prepare audio context
        window.removeEventListener('click', onFirstInteraction);
        window.removeEventListener('touchstart', onFirstInteraction);
      }
    };
    window.addEventListener('click', onFirstInteraction, { passive: true });
    window.addEventListener('touchstart', onFirstInteraction, { passive: true });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    this.updateUI(true);

    // If custom audio file is loaded and playable, use it
    if (this.customAudio && this.customAudio.getAttribute('src')) {
      this.customAudio.play().catch(() => {
        // Fallback to built-in royal synth if audio file fails
        this.startRoyalSynth();
      });
    } else {
      this.startRoyalSynth();
    }

    if (window.showAnniversaryToast) {
      window.showAnniversaryToast('🎵 Playing Royal Shehnai & Sitar Celebration Melody');
    }
  }

  pause() {
    this.isPlaying = false;
    this.updateUI(false);

    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.stopRoyalSynth();
  }

  updateUI(playing) {
    if (!this.audioBtn) return;
    if (playing) {
      this.audioBtn.classList.add('playing');
      if (this.audioIcon) {
        this.audioIcon.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <rect x="6" y="5" width="4" height="14" rx="1"/>
            <rect x="14" y="5" width="4" height="14" rx="1"/>
          </svg>
        `;
      }
    } else {
      this.audioBtn.classList.remove('playing');
      if (this.audioIcon) {
        this.audioIcon.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <polygon points="6,4 20,12 6,20"/>
          </svg>
        `;
      }
    }
  }

  /**
   * Built-in Web Audio API Royal Indian Classical Sitar & Flute Synthesizer
   * Plays a soothing, authentic meditative Raag celebration scale (Bilawal / Yaman / Des).
   */
  startRoyalSynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.synthContext) {
        this.synthContext = new AudioContext();
      }
      if (this.synthContext.state === 'suspended') {
        this.synthContext.resume();
      }

      const ctx = this.synthContext;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.synthNodes.push(masterGain);

      // 1. Tanpura Ambient Drone (Root D & Fifth A)
      const baseFreq = 146.83; // D3
      const droneFreqs = [baseFreq, baseFreq * 1.5, baseFreq * 2];
      droneFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow breathing drone modulation
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        this.synthNodes.push(osc);
      });

      // 2. Royal Sitar & Flute Raga Melody Sequences
      // Notes in Indian Raag Des / Yaman (D, E, F#, G, A, B, C#)
      const ragaNotes = [
        293.66, // D4 (Sa)
        329.63, // E4 (Re)
        369.99, // F#4 (Ga)
        392.00, // G4 (Ma)
        440.00, // A4 (Pa)
        493.88, // B4 (Dha)
        554.37, // C#5 (Ni)
        587.33, // D5 (High Sa)
        659.25, // E5
        739.99  // F#5
      ];

      // Melodic phrase progression
      const melodyPattern = [
        0, 1, 2, 4, 2, 1, 0, // Opening ascent & descent
        4, 5, 7, 6, 4, 2, 0, // Soaring phrase
        1, 2, 4, 7, 8, 7, 4, // Celebration crest
        2, 4, 2, 1, 0        // Gentle cadence
      ];

      let noteIndex = 0;
      const playNextNote = () => {
        if (!this.isPlaying) return;

        const noteFreq = ragaNotes[melodyPattern[noteIndex % melodyPattern.length]];
        noteIndex++;

        // Sitar pluck oscillator (rich harmonics + metallic brightness)
        const sitarOsc = ctx.createOscillator();
        const sitarGain = ctx.createGain();
        sitarOsc.type = 'sawtooth';
        sitarOsc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        // Slight microtone bend (meend) characteristic of sitar
        sitarOsc.frequency.exponentialRampToValueAtTime(noteFreq * 1.01, ctx.currentTime + 0.15);
        sitarOsc.frequency.exponentialRampToValueAtTime(noteFreq, ctx.currentTime + 0.4);

        // Pluck envelope: sharp attack, gentle decay
        const now = ctx.currentTime;
        sitarGain.gain.setValueAtTime(0, now);
        sitarGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        sitarGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        // Lowpass filter for warm wooden body acoustic resonance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(600, now + 1.2);

        sitarOsc.connect(filter);
        filter.connect(sitarGain);
        sitarGain.connect(masterGain);

        sitarOsc.start(now);
        sitarOsc.stop(now + 1.7);

        // Flute counter-melody (soft sine tone with gentle vibrato)
        if (Math.random() > 0.4) {
          const fluteOsc = ctx.createOscillator();
          const fluteGain = ctx.createGain();
          fluteOsc.type = 'sine';
          fluteOsc.frequency.setValueAtTime(noteFreq * 0.5, now + 0.1);

          fluteGain.gain.setValueAtTime(0, now + 0.1);
          fluteGain.gain.linearRampToValueAtTime(0.06, now + 0.3);
          fluteGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

          fluteOsc.connect(fluteGain);
          fluteGain.connect(masterGain);
          fluteOsc.start(now + 0.1);
          fluteOsc.stop(now + 2.1);
        }

        // Schedule next note with natural human rubato tempo
        const nextDelay = 800 + Math.random() * 600;
        this.timerId = setTimeout(playNextNote, nextDelay);
      };

      playNextNote();
    } catch (err) {
      console.warn('Web Audio playback error:', err);
    }
  }

  stopRoyalSynth() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.synthNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.synthNodes = [];
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.royalAudio = new RoyalAudioPlayer();
});
