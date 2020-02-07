import WebAuthn from 'webauthn';

const webAuthnServer = new WebAuthn({
  origin: 'http://localhost:3000',
  usernameField: 'username',
  userFields: {
    username: 'username',
    name: 'displayName'
  },
  rpName: 'Bini, Inc.',
  enableLogging: false,
  attestation: 'direct'
});

export default webAuthnServer;
