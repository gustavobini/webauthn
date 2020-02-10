import React, { useEffect, useReducer, useRef } from 'react';
import Head from 'next/head';

const publicKeyChallenge = new Uint8Array([
  // must be a cryptographically random number sent from a server
  0x8c,
  0x0a,
  0x26,
  0xff,
  0x22,
  0x91,
  0xc1,
  0xe9,
  0xb9,
  0x4e,
  0x2e,
  0x17,
  0x1a,
  0x98,
  0x6a,
  0x73,
  0x71,
  0x9d,
  0x43,
  0x48,
  0xd5,
  0xa7,
  0x6a,
  0x15,
  0x7e,
  0x38,
  0x94,
  0x52,
  0x77,
  0x97,
  0x0f,
  0xef
]).buffer;

const statusEnum = {
  registeringUser: 'registeringUser',
  promptingWebAuthn: 'promptingWebAuthn'
};

const actionEnum = {
  registrationSubmitted: 'registrationSubmitted'
};

function reducer(state, action) {
  switch (state.status) {
    case statusEnum.registeringUser:
      if (action.type === actionEnum.registrationSubmitted) {
        return {
          ...state,
          email: action.email,
          status: statusEnum.promptingWebAuthn
        };
      }

    default:
      return {
        ...state
      };
  }
}

export default function Main() {
  const inputEmailRef = useRef();
  const [state, dispatch] = useReducer(reducer, {
    status: statusEnum.registeringUser
  });

  const handleWebAuthnRequest = async () => {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: publicKeyChallenge,
          rp: {
            name: 'bini webauthn',
            id: 'localhost'
          },
          user: {
            id: new Uint8Array(16),
            email: state.email,
            name: state.email,
            displayName: state.email.split('@')[0]
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          timeout: 60000,
          attestation: 'direct'
        }
      });

      console.log(credential);
    } catch (error) {
      if (error instanceof DOMException) {
        // DOMException: The operation either timed out or was not allowed.
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const response = await fetch('/api/request-register', {
      method: 'POST',
      body: JSON.stringify({
        email: inputEmailRef.current.value
      })
    });

    if (!response.ok) {
      console.error(response);
    } else {
      console.log(response);
      dispatch({
        type: actionEnum.registrationSubmitted,
        email: inputEmailRef.current.value
      });
    }
  };

  return (
    <>
      <Head>
        <title>A WebAuthn experimentation.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {state.status === statusEnum.registeringUser && (
          <form onSubmit={handleSubmit}>
            <h1>Cadastro</h1>
            <fieldset>
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" ref={inputEmailRef} />
            </fieldset>
            <button type="submit">Cadastrar</button>
          </form>
        )}
        {state.status === statusEnum.promptingWebAuthn && (
          <button type="button" onClick={handleWebAuthnRequest}>
            Clique aqui para simplificar seu próximo acesso
          </button>
        )}
      </main>
    </>
  );
}
