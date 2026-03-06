import { InstagramProfile, HouseConfig } from './types';

export const getHouseConfig = (profile: InstagramProfile): HouseConfig => {
  const { followers, posts, following } = profile;

  let size: HouseConfig['size'] = 'cottage';
  if (followers > 100000000) size = 'castle';
  else if (followers > 10000000) size = 'mega-palace';
  else if (followers > 1000000) size = 'palace';
  else if (followers > 100000) size = 'mansion';
  else if (followers > 10000) size = 'villa';
  else if (followers > 1000) size = 'modern';

  let floors = 1;
  if (posts > 1000) floors = 5;
  else if (posts > 200) floors = 3;
  else if (posts > 50) floors = 2;

  let decorationLevel: HouseConfig['decorationLevel'] = 'minimal';
  if (following > 1000) decorationLevel = 'high';
  else if (following > 200) decorationLevel = 'medium';

  return { size, floors, decorationLevel };
};

export const ANIME_CHARACTERS = [
  'Naruto', 'Goku', 'Gojo', 'Levi', 'Luffy', 'Saitama', 'Itachi', 'Tanjiro'
];
