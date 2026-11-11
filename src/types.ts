export type DebateMode = 'pure_inquisitor' | 'cynical_academic' | 'malevolent_socratic' | 'machiavellian';

export interface Fallacy {
  name: string;
  userQuote: string;
  explanation: string;
}

export interface InconsistencyCheck {
  detected: boolean;
  detail: string;
}

export interface Message {
  id: string;
  role: 'user' | 'advocate';
  content: string;
  timestamp: string;
  round?: number;
  attackAngle?: string;
  fallacies?: Fallacy[];
  rhetoricalTrap?: string;
  closingBurn?: string;
  inconsistencyCheck?: InconsistencyCheck;
  userRigorScore?: number;
  userLogicHpDamage?: number;
  suggestedCounterDefense?: string[];
}

export interface DebateSession {
  id: string;
  topic: string;
  mode: DebateMode;
  language: 'id' | 'en';
  messages: Message[];
  userClaimsLedger: string[];
  userHp: number; // 0 - 100
  advocateHp: number; // 100
  round: number;
  status: 'active' | 'conceded' | 'completed';
  startedAt: string;
}

export interface FallacyGuide {
  id: string;
  name: string;
  latinName?: string;
  definition: string;
  example: string;
  howToRefute: string;
  severity: 'Tinggi' | 'Kritis' | 'Mematikan';
}
