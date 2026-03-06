export interface InstagramProfile {
  username: string;
  fullName: string;
  profilePic: string;
  followers: number;
  following: number;
  posts: number;
  biography?: string;
}

export interface AnimeAnalysis {
  characterName: string;
  reason: string;
  colorTheme: string;
}

export interface HouseConfig {
  size: 'cottage' | 'modern' | 'villa' | 'mansion' | 'palace' | 'mega-palace' | 'castle';
  floors: number;
  decorationLevel: 'minimal' | 'medium' | 'high';
}
