import faunadb from 'faunadb'
export const q = faunadb.query

export const client = new faunadb.Client({
  secret: process.env.FAUNA_API_KEY,
})
