import type { NextApiRequest, NextApiResponse } from 'next';
import Ably from 'ably/promises';

import { client, GAME_STATES, getGame, q } from '../../../../utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? undefined : req.query.id;

  if (req.method !== 'POST' || !id) {
    res.status(404).send('Page not found.');
    return;
  }

  const gameRef = q.Ref(q.Collection('games'), id);
  const game = await client.query(q.Get(gameRef));

  if (!game) {
    res.status(404).send('Page not found.');
    return;
  }

  await client.query(
    q.Update(gameRef, {
      data: {
        state: GAME_STATES.PLAYING,
      },
    })
  );

  const gameUpdate = await getGame(id);
  const ably = new Ably.Realtime('JZAjwg.MUUy-g:UCgDV0EqQBMaIIJo');
  const channel = ably.channels.get(id);

  channel.publish('update', gameUpdate);

  res.status(200).json(gameUpdate);
};
