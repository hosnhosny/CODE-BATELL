
export interface User {
  username: string;
  email: string;
  country: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  defaultCode: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

export const TrackType = {
  CPP: 'C++',
  SQL: 'SQL',
  CSHARP: 'C#',
  PYTHON: 'Python',
  JAVASCRIPT: 'JavaScript',
  JAVA: 'Java',
  REACT: 'React',
  LINUX: 'Linux',
  SWIFT: 'Swift',
  GO: 'Go',
  RUST: 'Rust',
  DART: 'Dart'
} as const;

export type TrackType = typeof TrackType[keyof typeof TrackType];

export const ARAB_COUNTRIES = [
  { name: 'الجزائر', code: 'DZ', flag: '🇩🇿' },
  { name: 'البحرين', code: 'BH', flag: '🇧🇭' },
  { name: 'جزر القمر', code: 'KM', flag: '🇰🇲' },
  { name: 'جيبوتي', code: 'DJ', flag: '🇩🇯' },
  { name: 'مصر', code: 'EG', flag: '🇪🇬' },
  { name: 'العراق', code: 'IQ', flag: '🇮🇶' },
  { name: 'الأردن', code: 'JO', flag: '🇯🇴' },
  { name: 'الكويت', code: 'KW', flag: '🇰🇼' },
  { name: 'لبنان', code: 'LB', flag: '🇱🇧' },
  { name: 'ليبيا', code: 'LY', flag: '🇱🇾' },
  { name: 'موريتانيا', code: 'MR', flag: '🇲🇷' },
  { name: 'المغرب', code: 'MA', flag: '🇲🇦' },
  { name: 'عمان', code: 'OM', flag: '🇴🇲' },
  { name: 'فلسطين', code: 'PS', flag: '🇵🇸' },
  { name: 'قطر', code: 'QA', flag: '🇶🇦' },
  { name: 'السعودية', code: 'SA', flag: '🇸🇦' },
  { name: 'الصومال', code: 'SO', flag: '🇸🇴' },
  { name: 'السودان', code: 'SD', flag: '🇸🇩' },
  { name: 'سوريا', code: 'SY', flag: '🇸🇾' },
  { name: 'تونس', code: 'TN', flag: '🇹🇳' },
  { name: 'الإمارات', code: 'AE', flag: '🇦🇪' },
  { name: 'اليمن', code: 'YE', flag: '🇾🇪' }
];
