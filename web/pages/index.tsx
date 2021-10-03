import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import withSession, { ServerSideHandler } from '@/lib/session';
import Account from '@/models/Account';

import stravaSettings from '@/services/strava/settings.json';

const IndexPage: NextPage = () => {
  const envStravaSettings = stravaSettings[process.env.NODE_ENV];

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="Get a notification to maintain your gear"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gear Alert</h1>

        <p className={styles.description}>
          Get a notification to maintain your gear
        </p>

        <div className={styles.grid}>
          <a
            href={`http://www.strava.com/oauth/authorize?client_id=${envStravaSettings.clientId}&response_type=code&redirect_uri=${envStravaSettings.redirect_uri}&approval_prompt=force&scope=${envStravaSettings.scope}`}
          >
            Connect with strava
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export const getServerSideProps = withSession<ServerSideHandler>(
  async function ({ req, res }) {
    const account = await Account.findOne({ id: req.session.get('accountId') });
    if (account) {
      res.setHeader('location', '/gear');
      res.statusCode = 302;
      res.end();
      return { props: { account } };
    }

    return {
      props: {},
    };
  }
);

export default IndexPage;
