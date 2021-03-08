import type { NextApiRequest, NextApiResponse } from 'next'

import { client, GAME_STATES, q } from '../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? undefined : req.query.id

  if (req.method !== 'POST' || !id) {
    res.status(404).send('Page not found.')
    return
  }

  const gameRef = q.Ref(q.Collection('games'), id)
  const game = await client.query(q.Get(gameRef))

  if (!game) {
    res.status(404).send('Page not found.')
    return
  }

  await client.query(
    q.Update(gameRef, {
      data: {
        state: GAME_STATES.PLAYING,
      },
    })
  )

  res.status(200).json({
    id,
    state: GAME_STATES.PLAYING,
  })
}
