import faunadb from 'faunadb';
export const q = faunadb.query;

export const client = new faunadb.Client({
  secret: 'fnAEDYq3gRACB3i-Tq3DOYOSsYtFYJZlqDgK6C92',
});
