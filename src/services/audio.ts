// --- START OF FILE src/services/audio.ts ---

class AudioService {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private volume: number = 0.25;
  private errorCount: number = 0; // عداد لحماية المتصفح من التكرار اللانهائي

  // قمنا بتغيير الروابط إلى روابط خارجية تعمل مباشرة للتجربة
  // يمكنك لاحقاً استبدالها بملفاتك المحلية
  private epicMusicLinks = [
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-city-110261.mp3', 
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=epic-cinematic-trailer-113583.mp3',
    'https://cdn.pixabay.com/download/audio/2021/11/23/audio_035a3a1651.mp3?filename=technology-background-106571.mp3'
  ];
  private currentLinkIndex = 0;

  constructor() {
    const savedVolume = localStorage.getItem('cb_volume');
    if (savedVolume) this.volume = parseFloat(savedVolume);

    const savedTrack = localStorage.getItem('cb_track_index');
    if (savedTrack) {
        const index = parseInt(savedTrack);
        // تأكد أن الرقم المحفوظ ضمن حدود المصفوفة
        if (index >= 0 && index < this.epicMusicLinks.length) {
            this.currentLinkIndex = index;
        }
    }
    
    this.setupAudio();
  }

  private setupAudio() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.src = "";
    }

    this.bgMusic = new Audio();
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume;
    this.bgMusic.crossOrigin = "anonymous"; // ضروري للروابط الخارجية
    
    this.bgMusic.src = this.epicMusicLinks[this.currentLinkIndex];

    // معالجة الأخطاء المحسنة لمنع التكرار اللانهائي
    this.bgMusic.onerror = (e) => {
      console.warn(`فشل تحميل المقطع رقم ${this.currentLinkIndex + 1}.`, e);
      
      this.errorCount++;
      
      // إذا فشل التحميل 3 مرات (بعدد الأغاني)، توقف عن المحاولة
      if (this.errorCount < this.epicMusicLinks.length) {
          console.log("جاري محاولة تشغيل المقطع التالي...");
          setTimeout(() => this.nextTrack(), 2000); // زدنا الوقت لـ 2 ثانية
      } else {
          console.error("توقف النظام الصوتي: لا يمكن تحميل أي ملف صوتي.");
          this.isMusicPlaying = false;
      }
    };

    // إعادة تعيين عداد الأخطاء عند النجاح في التحميل
    this.bgMusic.oncanplay = () => {
        this.errorCount = 0;
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
    } catch (e) {
      console.error("AudioContext Error:", e);
    }
  }

  toggleBackgroundMusic(): boolean {
    this.initContext();
    if (!this.bgMusic) return false;
    
    // إعادة تعيين العداد عند محاولة التشغيل اليدوي
    this.errorCount = 0;

    if (this.isMusicPlaying) {
      this.bgMusic.pause();
      this.isMusicPlaying = false;
    } else {
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
    
    localStorage.setItem('cb_track_index', this.currentLinkIndex.toString());

    const wasPlaying = this.isMusicPlaying;
    
    this.setupAudio();
    
    if (wasPlaying) {
      // إعادة تعيين العداد لأن المستخدم طلب التغيير بنفسه
      this.errorCount = 0;
      this.bgMusic?.play().catch(e => console.error("Error playing next track:", e));
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