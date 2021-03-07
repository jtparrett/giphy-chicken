import type { NextApiRequest, NextApiResponse } from 'next';
import qs from 'query-string';

import { Entry } from '../../../../types';
import { client, GAME_STATES, q } from '../../../../utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? undefined : req.query.id;

  if (req.method !== 'POST' || !id) {
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

  if (!body.userId) {
    res.status(500).json({ message: 'Missing userId parameter' });
    return;
  }

  const gameRef = q.Ref(q.Collection('games'), id);
  const game = await client.query(q.Get(gameRef));

  if (!game) {
    res.status(404).send('Page not found.');
    return;
  }

  const userRef = q.Ref(q.Collection('users'), body.userId);

  await client.query(
    q.If(
      q.Equals(gameRef, q.Select(['data', 'game'], q.Get(userRef))),
      null,
      q.Abort('Invalid userId for gameId')
    )
  );

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

  const newTerms = {
    term1,
    term2,
    term3,
    [`term${body.termIndex}`]: body.term,
  };

  const params = qs.stringify({
    api_key: process.env.GIPHY_API_KEY,
    limit: 1,
    offset: Math.floor(Math.random() * 100),
    q: `${newTerms.term1} ${newTerms.term2} ${newTerms.term2}`,
  });

  const gifs = await fetch(
    `https://api.giphy.com/v1/gifs/search?${params}`
  ).then((r) => r.json());

  const [gif] = gifs.data;

  const entry = await client.query(
    q.Select(
      ['data'],
      q.Create(q.Collection('entries'), {
        data: {
          ...newTerms,
          game: gameRef,
          giphyId: gif.id,
          giphyRating: gif.rating,
          user: userRef,
        },
      })
    )
  );

  if (gif.rating === 'r') {
    await client.query(
      q.Update(gameRef, {
        data: {
          state: GAME_STATES.FINISHED,
        },
      })
    );
  }

  res.status(200).json(entry);
};
