/* eslint-disable prettier/prettier */
export interface ProfileEnum {
  id: string;
  profile: Profile;
}

export interface Profile {
  first_name: string;
  last_name: string;
  age: number;
  favorites: string;
  profileId: string | null;
}
export interface ReqFavorites {
  id: string;
  profile: Profile;
}

export interface Profile {
  favorites: string;
}
