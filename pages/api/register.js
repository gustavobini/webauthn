import webAuthnServer from '../../relying-party/webauthn-server';

export default (req, res) => {
  webAuthnServer.register({});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ name: 'John Doe' }));
};
