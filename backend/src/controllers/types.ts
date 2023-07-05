// types.ts
export interface SignUpBody {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number;
  orientation?: string;
  bio?: string;
  interests?: string;
  location?: string;
  profilePicture?: string;
  connections?: {
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    spotifyLink?: string;
    soundcloudLink?: string;
  };
  disliked?: string[];
  favouriteSongs?: { id: string; name: string }[];
  favouriteArtists?: { id: string; name: string }[];
  favouriteAlbums?: { id: string; name: string }[];
  favouriteGenres?: { id: string; name: string }[];
}

  
  export interface LoginBody {
    username: string;
    password: string;
  }
  