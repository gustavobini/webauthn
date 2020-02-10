import { generateRegistrationChallenge } from '@webauthn/server';
import { createUser } from '../../db/user';
import { rpConfig } from '../../relying-party/config';

export default async (req, res) => {
  const { email } = JSON.parse(req.body);

  try {
    const challengeResponse = generateRegistrationChallenge({
      relyingParty: { name: rpConfig.name },
      user: { name: email }
    });

    await createUser({ email, challenge: challengeResponse.challenge });

    res.status(200).json(challengeResponse);
  } catch (error) {
    res.status(400).json(error);
  }
};
