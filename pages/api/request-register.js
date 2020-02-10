import uuid from 'uuid/v4';
import { generateRegistrationChallenge } from '@webauthn/server';

import { createUser } from '../../db/user';
import { rpConfig } from '../../relying-party/config';

export default async (req, res) => {
  try {
    const { email } = JSON.parse(req.body);
    const id = uuid();
    const challengeResponse = generateRegistrationChallenge({
      relyingParty: { name: rpConfig.name },
      user: { id, name: email }
    });

    await createUser({ id, email, challenge: challengeResponse.challenge });

    res.status(200).json(challengeResponse);
  } catch (error) {
    res.status(400).json(error);
  }
};
