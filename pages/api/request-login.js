import { generateLoginChallenge } from '@webauthn/server';
import { updateUserChallenge, findByEmail } from '../../db/user';

export default (req, res) => {
  const { email } = req.body;

  const user = findByEmail(email);

  if (!user) {
    return res.status(400);
  }

  const assertionChallenge = generateLoginChallenge(user.key);

  updateUserChallenge(user, assertionChallenge.challenge);

  res.status(200).json(assertionChallenge);
};
