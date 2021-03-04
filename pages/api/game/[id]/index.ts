import type { NextApiRequest, NextApiResponse } from 'next';

import { client, q } from '../../../../utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.status(404).send('Page not found.');
    return;
  }

  const {
    query: { id },
  } = req;

  if (!id) {
    res.status(500).json({
      message: 'Missing id parameter',
    });
    return;
  }

  try {
    const gameData = await client.query(
      q.Select(['data'], q.Get(q.Ref(q.Collection('games'), id)))
    );

    const users = await client.query(
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

    const entries = await client.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index('entries_by_game'), q.Ref(q.Collection('games'), id))
        ),
        q.Lambda(
          'entry',
          q.Merge(
            { id: q.Select(['ref', 'id'], q.Get(q.Var('entry'))) },
            q.Select(['data'], q.Get(q.Var('entry')))
          )
        )
      )
    );

    const turnUser = users.data[entries.data.length % users.data.length];

    res.status(200).json({
      id,
      ...gameData,
      turnUser,
      users,
      entries,
    });
  } catch {
    res.status(404).send('Page not found.');
  }
};
