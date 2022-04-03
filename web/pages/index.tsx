import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { withSessionSsr } from '@/lib/session';
import Account from '@/models/Account';
import ConnectWithStrava from '@/components/buttons/ConnectWithStrava';

const IndexPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gear Alert</title>
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
          <ConnectWithStrava />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}): Promise<{ props: any }> {
  const account = await Account.findOne({ id: req.session.accountId });
  if (account) {
    res.setHeader('location', '/gear');
    res.statusCode = 302;
    res.end();
    return { props: { account } };
  }

  return {
    props: {},
  };
});

export default IndexPage;
