// --- START OF FILE audio.ts ---

class AudioService {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private volume: number = 0.25;
  
  // تعديل: استخدام مسارات محلية من مجلد public
  // تأكد أنك وضعت الملفات في المجلد public/music/
  private epicMusicLinks = [
    '/music/bg1.mp3', 
    '/music/bg2.mp3',
    '/music/bg3.mp3'
  ];
  private currentLinkIndex = 0;

  constructor() {
    // استعادة مستوى الصوت المحفوظ
    const savedVolume = localStorage.getItem('cb_volume');
    if (savedVolume) this.volume = parseFloat(savedVolume);
    
    // إعداد الصوت الأولي (بدون تشغيل تلقائي لتجنب سياسات المتصفح)
    this.setupAudio();
  }

  private setupAudio() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.src = ""; // تنظيف المصدر القديم
    }

    this.bgMusic = new Audio();
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume;
    
    // هام: إزالة crossOrigin للملفات المحلية لتجنب مشاكل CORS غير الضرورية
    // this.bgMusic.crossOrigin = "anonymous"; 

    // تعيين الرابط المحلي
    this.bgMusic.src = this.epicMusicLinks[this.currentLinkIndex];

    this.bgMusic.onerror = (e) => {
      console.warn("فشل تحميل المقطع الصوتي المحلي، تأكد من وجود الملفات في مجلد public/music", e);
      // محاولة الانتقال للتالي في حالة تلف الملف
      // نستخدم Timeout لتجنب الدخول في حلقة لانهائية سريعة
      setTimeout(() => this.nextTrack(), 1000);
    };
  }

  private initContext() {
    try {
      // إنشاء السياق الصوتي فقط عند تفاعل المستخدم
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.error("AudioContext Error:", e);
    }
  }

  toggleBackgroundMusic(): boolean {
    this.initContext();
    if (!this.bgMusic) return false;
    
    if (this.isMusicPlaying) {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
    } else {
      // التعامل مع Promise التشغيل لتجنب الأخطاء
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isMusicPlaying = true;
        }).catch((error) => {
          console.error("Autoplay prevented:", error);
          this.isMusicPlaying = false;
        });
      }
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
      this.bgMusic?.play().catch(e => console.error("Error playing next track:", e));
    }
  }

  getMusicState(): boolean {
    return this.isMusicPlaying;
  }

  getCurrentTrackName(): string {
    return `Track #${this.currentLinkIndex + 1}`;
  }

  // استخدام Web Audio API للمؤثرات الصوتية (SFX)
  private playNote(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // تحسين التعامل مع مستوى الصوت لتجنب "طقطقة" الصوت
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * this.volume * 4, this.ctx.currentTime + 0.01);
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