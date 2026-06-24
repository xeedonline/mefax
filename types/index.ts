export interface FastTextLink {
  page: number;
  label: string;
}

export interface FastTextLinks {
  red?: FastTextLink;
  green?: FastTextLink;
  yellow?: FastTextLink;
  blue?: FastTextLink;
}

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string;
}

export interface WeatherCity {
  name: string;
  country?: string;
  lat: number;
  lon: number;
  temp?: number;
  feelsLike?: number;
  windSpeed?: number;
  windDir?: string;
  condition?: string;
  conditionCode?: number;
  humidity?: number;
  forecast?: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  conditionCode: number;
  rain: number;
}

export interface FlightData {
  callsign: string;
  icao24: string;
  originCountry: string;
  lat: number | null;
  lon: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  onGround: boolean;
  lastSeen: number;
}

export interface FinanceData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  answers: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  score: number;
  lives: number;
  currentQuestion: number;
  answered: boolean;
  selectedAnswer: number | null;
  category: string;
  gamePhase: 'intro' | 'category' | 'question' | 'result' | 'gameover';
  timeLeft: number;
}
