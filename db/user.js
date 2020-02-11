import faunadb from "faunadb";

const q = faunadb.query;

function dbClient() {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_DB_WEBAUTHN_DEMO
  });

  return client;
}

export async function createUser({ id, email, challenge }) {
  const dbResponse = await dbClient().query(
    q.Create(q.Collection("user"), { data: { id, email, challenge } })
  );
}

export async function findByChallenge(challenge) {
  const dbResponse = await dbClient().query(
    q.Get(q.Match(q.Index("users_by_challenge"), challenge))
  );

  return dbResponse;
}

export async function addKeyToUser({ user, key }) {
  console.error("addKeyToUser", { user });

  const dbResponse = await dbClient().query(
    q.Update(user.ref, {
      data: { key }
    })
  );

  console.error(dbResponse);
}

export function findByEmail() {}

export function updateUserChallenge() {}
