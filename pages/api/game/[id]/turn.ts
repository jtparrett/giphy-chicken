import type { NextApiRequest, NextApiResponse } from 'next';

import { Entry } from '../../../../types';
import { client, q } from '../../../../utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(404).send('Page not found.');
    return;
  }

  const body = JSON.parse(req.body);

  if (!body || !body.term) {
    res.status(500).json({ message: 'Missing term parameter' });
    return;
  }

  if (
    body.termIndex === undefined ||
    body.termIndex < 1 ||
    body.termIndex > 3
  ) {
    res
      .status(500)
      .json({ message: 'Incorrect termIndex parameter, must be 1, 2 or 3' });
    return;
  }

  const {
    query: { id },
  } = req;

  const gameRef = q.Ref(q.Collection('games'), id);
  const game = await client.query(q.Get(gameRef));

  if (!game) {
    res.status(404).send('Page not found.');
    return;
  }

  const entries: { data: Entry[] } = await client.query(
    q.Map(
      q.Paginate(
        q.Match(q.Index('entries_by_game'), q.Ref(q.Collection('games'), id)),
        {
          size: 1,
        }
      ),
      q.Lambda('entry', q.Select(['data'], q.Get(q.Var('entry'))))
    )
  );
  const { term1, term2, term3 } = entries.data[0];

  const entry = await client.query(
    q.Create(q.Collection('entries'), {
      data: {
        term1,
        term2,
        term3,
        [`term${body.termIndex}`]: body.term,
        game: gameRef,
      },
    })
  );

  res.status(200).json(entry);
};
