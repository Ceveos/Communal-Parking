import { NextPage } from 'next';
import Features from './features';
import Head from 'next/head';
import Hero from './hero';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Communal Parking</title>
      </Head>
      <Hero/>
      <Features/>
    </>
  );
};

export default Home;
