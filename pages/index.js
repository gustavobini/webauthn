import React from 'react';
import Head from 'next/head';

export default function Main() {
  React.useEffect(async () => {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>A WebAuthn experimentation.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
}
