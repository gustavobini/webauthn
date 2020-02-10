import {
  parseLoginRequest,
  verifyAuthenticatorAssertion
} from '@webauthn/server';
import { findByChallenge } from '../../db/user';

export default (req, res) => {
  const { challenge, keyId } = parseLoginRequest(req.body);

  if (!challenge) {
    return res.status(400);
  }

  const user = findByChallenge(challenge);

  if (!user || !user.key || user.key.credID !== keyId) {
    return res.status(400);
  }

  const loggedIn = verifyAuthenticatorAssertion(req.body, user.key);

  return res.status(200).json({ loggedIn });
};
