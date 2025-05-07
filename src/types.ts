// types.ts
export interface User {
    _id: string;
    username: string;
    most_played_game?: string;
  }
  
  export interface Game {
    _id: string;
    name: string;
    genre: string;
    photo: string;
  }
  
  export interface Owned {
    _id: string;
    userId: string;
    gameId: string;
    hoursPlayed: number;
    rating?: number;
    comments: Array<{
      username: string;
      text: string;
    }>;
  }