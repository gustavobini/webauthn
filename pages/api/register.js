import { parseRegisterRequest } from "@webauthn/server";
import { findByChallenge, addKeyToUser } from "../../db/user";

export default async (req, res) => {
  try {
    const body = JSON.parse(req.body);
    const { key, challenge } = parseRegisterRequest(body);
    const user = await findByChallenge(challenge);

    console.error({ user });

    if (!user) {
      return res.status(404).end();
    }

    await addKeyToUser({ user, key });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
