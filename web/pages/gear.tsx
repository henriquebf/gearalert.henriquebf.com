import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import withSession, { ServerSideHandler } from '@/lib/session';
import Account, { AccountRecord } from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';
import GearItem from '@/components/GearItem';

type Props = { account: AccountRecord; gears: GearRecord[] };

const GearPage = ({ account, gears }: Props) => {
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

      <p className={styles.description}>Hello {account.firstname}</p>

      <div className={styles.grid}>
        {gears.map((gear) => (
          <div key={gear.id} className={styles.card}>
            <GearItem gear={gear} />
          </div>
        ))}
      </div>

      <main className={styles.main}>
        <div className={styles.grid}>
          <a href={`/api/logout`}>logout</a>
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
    if (!account) {
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }

    const gears = await Gear.find({ accountId: account.id });

    return {
      props: { account, gears },
    };
  }
);

export default GearPage;
