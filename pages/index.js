import React, { useEffect, useReducer, useRef } from 'react';
import Head from 'next/head';

import { solveRegistrationChallenge } from '@webauthn/client';

const statusEnum = {
  registeringUser: 'registeringUser',
  promptingWebAuthn: 'promptingWebAuthn',
  userRegistered: 'userRegistered',
  error: 'error'
};

const actionEnum = {
  registrationRequested: 'registrationRequested',
  registrationCompleted: 'registrationCompleted',
  restart: 'restart'
};

function reducer(state, action) {
  switch (state.status) {
    case statusEnum.registeringUser:
      if (action.type === actionEnum.registrationRequested) {
        return {
          ...state,
          challenge: action.challenge,
          status: statusEnum.promptingWebAuthn
        };
      }

    case statusEnum.promptingWebAuthn:
      if (action.type === actionEnum.registrationCompleted) {
        return {
          ...state,
          status: statusEnum.userRegistered
        };
      }

      if (action.type === actionEnum.registrationError) {
        return {
          ...state,
          status: statusEnum.error
        };
      }

    case statusEnum.error:
      if (action.type === actionEnum.restart) {
        return {
          status: statusEnum.registeringUser
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
      const credentials = await solveRegistrationChallenge(state.challenge);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          credentials
        })
      });

      if (response.ok) {
        dispatch({
          type: actionEnum.registrationCompleted
        });
      } else {
        dispatch({
          type: actionEnum.registrationError
        });
      }
    } catch (error) {
      if (error instanceof DOMException) {
        // DOMException: The operation either timed out or was not allowed.
      }
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    // const response = await fetch('/api/request-register', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     email: inputEmailRef.current.value
    //   })
    // });

    const response1 = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        key: 'abc',
        challenge: 'def'
      })
    });

    // if (response.ok) {
    //   const challenge = await response.json();

    //   dispatch({
    //     type: actionEnum.registrationRequested,
    //     challenge
    //   });
    // } else {
    //   console.error(response);
    // }
  };

  const handleError = event => {
    dispatch({
      type: actionEnum.restart
    });
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
            Cadastre seu fator de autenticação
          </button>
        )}
        {state.status === statusEnum.error && (
          <button type="button" onClick={handleError}>
            Ocorreu algum erro - reinicie o processo.
          </button>
        )}
      </main>
    </>
  );
}
