/**
 * Sound effects utility for chess moves
 */

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
    }

    // Initialize audio context
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Play move sound (simple beep)
    playMove() {
        if (!this.enabled) return;
        this.init();
        this.playTone(800, 0.1, 0.1);
    }

    // Play capture sound (double beep)
    playCapture() {
        if (!this.enabled) return;
        this.init();
        this.playTone(600, 0.1, 0.1);
        setTimeout(() => this.playTone(400, 0.1, 0.1), 100);
    }

    // Generate tone
    playTone(frequency, duration, volume) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

export const soundManager = new SoundManager();