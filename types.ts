
export enum AppTab {
  IDENTIFY = 'identify',
  CHAT = 'chat'
}

export interface RockAnalysis {
  name: string;
  category: string;
  chemicalFormula: string;
  hardness: string;
  description: string;
  geologicalContext: string;
  rarity: string;
  funFact: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
