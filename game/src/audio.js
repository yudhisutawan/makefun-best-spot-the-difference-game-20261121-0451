// All sound comes from the Web Audio API — oscillators only, no audio files, no network.
// The context is created lazily on the first user gesture (browsers block audio before
// one), and every call is safe when audio is off or unavailable.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch {
      return null;
    }
    return ctx;
  }

  function tone(freq, start, duration, type = 'sine', volume = 0.12) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ac.currentTime + start);
      gain.gain.linearRampToValueAtTime(volume, ac.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + start);
      osc.stop(ac.currentTime + start + duration + 0.05);
    } catch {
      // Audio is decoration: never let it break the game.
    }
  }

  return {
    unlock() { ensure(); },
    toggleMute() { muted = !muted; return muted; },
    isMuted() { return muted; },
    /** Two-note chime when a difference is found. */
    found() { tone(660, 0, 0.14, 'sine', 0.14); tone(990, 0.09, 0.22, 'sine', 0.14); },
    /** Low buzz for a wrong click. */
    wrong() { tone(140, 0, 0.18, 'sawtooth', 0.07); },
    /** Soft tick for the last ten seconds. */
    tick() { tone(880, 0, 0.06, 'square', 0.05); },
    /** Rising arpeggio when a level is cleared. */
    levelClear() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.2, 'triangle', 0.12));
    },
    /** Full fanfare when the game is won. */
    win() {
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.12));
    },
  };
}
