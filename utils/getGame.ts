import { Entry, User } from '../types';
import { client, q } from './fauna';

export const getGame = async (id: string) => {
  const gameData = await client.query(
    q.Select(['data'], q.Get(q.Ref(q.Collection('games'), id)))
  );

  const users: { data: User[] } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('users_by_game'), q.Ref(q.Collection('games'), id))
      ),
      q.Lambda('user', {
        id: q.Select(['ref', 'id'], q.Get(q.Var('user'))),
        name: q.Select(['data', 'name'], q.Get(q.Var('user'))),
      })
    )
  );

  const entries: { data: Entry[] } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('entries_by_game'), q.Ref(q.Collection('games'), id))
      ),
      q.Lambda(
        'entry',
        q.Merge(
          {
            id: q.Select(['ref', 'id'], q.Get(q.Var('entry'))),
          },
          q.Select(['data'], q.Get(q.Var('entry')))
        )
      )
    )
  );

  const turnUser = users.data[entries.data.length % users.data.length];

  return {
    id,
    ...gameData,
    entries,
    users,
    turnUser,
  };
};
