import { parseRegisterRequest } from '@webauthn/server';
import { findByChallenge, addKeyToUser } from '../../db/user';

export default async (req, res) => {
  try {
    const { key, challenge } = parseRegisterRequest(req.body);

    const user = await findByChallenge(challenge);

    console.log(user);

    if (!user) {
      return res.status(400);
    }

    await addKeyToUser({ user, key });

    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
