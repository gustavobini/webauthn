import faunadb from 'faunadb';

const q = faunadb.query;

function dbClient() {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB_WEBAUTHN_DEMO
  });

  return client;
}

export async function createUser({ id, email, challenge }) {
  const dbResponse = await dbClient().query(
    q.Create(q.Collection('user'), { data: { id, email, challenge } })
  );
}

export function findByChallenge() {}

export function addKeyToUser() {}

export function findByEmail() {}

export function updateUserChallenge() {}
