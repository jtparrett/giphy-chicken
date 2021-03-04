import type { NextApiRequest, NextApiResponse } from 'next';
import { client, q, GAME_STATES } from '../../utils';
import randomWords from 'random-words';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).send('Page not found.');
    return;
  }

  const body = JSON.parse(req.body);

  if (!body || !body.name) {
    res.status(500).json({ message: 'Missing name parameter' });
    return;
  }

  const gameId = await client.query(
    q.Select(
      ['ref', 'id'],
      q.Create(q.Collection('games'), {
        data: {
          state: GAME_STATES.UNSTARTED,
        },
      })
    )
  );

  const userId = await client.query(
    q.Select(
      ['ref', 'id'],
      q.Create(q.Collection('users'), {
        data: {
          game: q.Ref(q.Collection('games'), gameId),
          name: body.name,
        },
      })
    )
  );

  const [term1, term2, term3] = randomWords(3);
  await client.query(
    q.Create(q.Collection('entries'), {
      data: {
        term1,
        term2,
        term3,
        game: q.Ref(q.Collection('games'), gameId),
      },
    })
  );

  res.status(200).json({
    userId,
    gameId,
  });
};
