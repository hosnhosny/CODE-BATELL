
class AudioService {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private volume: number = 0.25;
  
  private epicMusicLinks = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://assets.mixkit.co/music/preview/mixkit-epic-war-634.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  ];
  private currentLinkIndex = 0;

  constructor() {
    this.setupAudio();
    // استعادة مستوى الصوت المحفوظ
    const savedVolume = localStorage.getItem('cb_volume');
    if (savedVolume) this.volume = parseFloat(savedVolume);
  }

  private setupAudio() {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }

    this.bgMusic = new Audio();
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume;
    this.bgMusic.crossOrigin = "anonymous";
    this.bgMusic.src = this.epicMusicLinks[this.currentLinkIndex];

    this.bgMusic.onerror = () => {
      console.warn("فشل تحميل المقطع، جاري الانتقال للتالي...");
      this.nextTrack();
    };
  }

  private initContext() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {}
  }

  toggleBackgroundMusic(): boolean {
    this.initContext();
    if (!this.bgMusic) return false;
    
    if (this.isMusicPlaying) {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
    } else {
      this.bgMusic.play().then(() => {
        this.isMusicPlaying = true;
      }).catch(() => {
        this.isMusicPlaying = false;
      });
    }
    return this.isMusicPlaying;
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.bgMusic) this.bgMusic.volume = v;
    localStorage.setItem('cb_volume', v.toString());
  }

  getVolume(): number {
    return this.volume;
  }

  nextTrack() {
    this.currentLinkIndex = (this.currentLinkIndex + 1) % this.epicMusicLinks.length;
    const wasPlaying = this.isMusicPlaying;
    this.setupAudio();
    if (wasPlaying) {
      this.bgMusic?.play().catch(() => {});
    }
  }

  getMusicState(): boolean {
    return this.isMusicPlaying;
  }

  getCurrentTrackName(): string {
    return `Track #${this.currentLinkIndex + 1}`;
  }

  private playNote(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume * this.volume * 4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playClick() { this.playNote(800, 'sine', 0.1, 0.05); }
  playNav() { this.playNote(400, 'triangle', 0.2, 0.03); }
  playAIActivate() { this.playNote(600, 'sine', 0.1, 0.05); setTimeout(() => this.playNote(900, 'sine', 0.1, 0.05), 50); }
  playSuccess() { [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => setTimeout(() => this.playNote(f, 'sine', 0.5, 0.1), i * 100)); }
  playError() { this.playNote(150, 'sawtooth', 0.3, 0.05); }
}

export const audioService = new AudioService();
