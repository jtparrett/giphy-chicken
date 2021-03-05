import type { NextApiRequest, NextApiResponse } from 'next';
import { Game } from '../../../../types';

import { client, GAME_STATES, q } from '../../../../utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? undefined : req.query.id;

  if (req.method !== 'POST' || !id) {
    res.status(404).send('Page not found.');
    return;
  }

  const body = JSON.parse(req.body);

  if (!body || !body.name) {
    res.status(500).json({ message: 'Missing name parameter' });
    return;
  }

  const game: Game = await client.query(
    q.Select(['data'], q.Get(q.Ref(q.Collection('games'), id)))
  );

  if (!game || game.state === GAME_STATES.PLAYING) {
    res.status(404).send('Page not found.');
    return;
  }

  const userId: string = await client.query(
    q.Select(
      ['ref', 'id'],
      q.Create(q.Collection('users'), {
        data: {
          game: q.Ref(q.Collection('games'), id),
          name: body.name,
        },
      })
    )
  );

  res.status(200).json({
    id: userId,
  });
};
