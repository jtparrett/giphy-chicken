export type GameState = 'UNSTARTED' | 'PLAYING' | 'FINISHED';

export interface User {
  id: string;
  name: string;
  game: Game;
}

export interface Entry {
  id: string;
  term1: string;
  term2: string;
  term3: string;
  giphyId: string;
  giphyRating: string;
  user: User;
}

export interface Game {
  id: string;
  state: GameState;
  turnUser: User;
  users: {
    data: User[];
  };
  entries: {
    data: Entry[];
  };
}
