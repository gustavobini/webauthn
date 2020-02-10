import { parseRegisterRequest } from '@webauthn/server';
import { findByChallenge, addKeyToUser } from '../../db/user';

export default (req, res) => {
  const { key, challenge } = parseRegisterRequest(req.body);

  const user = findByChallenge(challenge);

  if (!user) {
    return res.status(400);
  }

  addKeyToUser(user, key);

  res.status(200);
};
