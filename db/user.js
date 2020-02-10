import faunadb from 'faunadb';
import uuid from 'uuid/v4';

const q = faunadb.query;

function dbClient() {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB_WEBAUTHN_DEMO
  });

  return client;
}

export async function createUser({ email, challenge }) {
  try {
    const id = uuid();
    const dbResponse = await dbClient().query(
      q.Create(q.Collection('user'), { data: { id, email, challenge } })
    );

    console.log(dbResponse);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function findByChallenge() {}

export function addKeyToUser() {}

export function findByEmail() {}

export function updateUserChallenge() {}
