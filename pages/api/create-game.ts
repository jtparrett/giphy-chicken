import type { NextApiRequest, NextApiResponse } from 'next';
import { client, q, GAME_STATES } from '../../utils';
import randomWords from 'random-words';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).send('POST requests only.');
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

  const [term1, term2, term3] = randomWords(3);

  await client.query(
    q.Create(q.Collection('entries'), {
      data: {
        term1,
        term2,
        term3,
        game: q.Ref(q.Collection('games'), gameId),
        giphyId: 'xT8qB2zDVGj7ly4moU',
      },
    })
  );

  res.status(200).json({
    gameId,
  });
};
