// src/pages/_app.js
import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from "@material-tailwind/react";
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <title>Streamhub - Descubre películas y series</title>
        <meta name="description" content="Plataforma de streaming y descubrimiento de películas y series" />
        <link href="https://fonts.googleapis.com/css?family=Lato:400,600,700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;