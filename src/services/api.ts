import { InstagramProfile, AnimeAnalysis } from '../types';

export const fetchInstagramProfile = async (username: string): Promise<InstagramProfile> => {
  const response = await fetch(`/api/instagram/${username}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch profile');
  }
  return response.json();
};

export const analyzeProfile = async (profile: InstagramProfile, refinement?: string): Promise<AnimeAnalysis> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...profile, refinement })
  });
  if (!response.ok) {
    throw new Error('Failed to analyze profile');
  }
  return response.json();
};
