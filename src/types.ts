export interface InstagramProfile {
  username: string;
  fullName: string;
  profilePic: string;
  followers: number;
  following: number;
  posts: number;
  biography?: string;
}

export interface CharacterStats {
  power: number; // 1-10
  speed: number; // 1-10
  technique: number; // 1-10
  intelligence: number; // 1-10
  aura: number; // 1-10
  potential: number; // 1-10
}

export interface AnimeAnalysis {
  characterName: string;
  animeName: string;
  signatureAbility: string;
  stats: CharacterStats;
  reason: string;
  imageUrl: string;
  matchPercentage: number;
  characterArchetype: string;
  colorTheme: string;
}
