import type { NextApiRequest, NextApiResponse } from 'next'

import { getGame } from '../../../../utils'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Array.isArray(req.query.id) ? undefined : req.query.id

  if (req.method !== 'GET' || !id) {
    res.status(404).send('Page not found.')
    return
  }

  try {
    const game = await getGame(id)
    res.status(200).json(game)
  } catch (e) {
    console.log(e)
    res.status(500).send('Internal server error')
  }
}
