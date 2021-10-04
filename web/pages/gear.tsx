import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import withSession, { ServerSideHandler } from '@/lib/session';
import Account, { AccountRecord } from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';
import GearItem from '@/components/GearItem';

type Props = { account: AccountRecord; gears: GearRecord[] };

const GearPage = ({ account, gears }: Props) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

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

      <p className={styles.description}>Hello, {account.firstname}.</p>

      <div className={styles.grid}>
        {gears.map((gear) => (
          <div key={gear.id} className={styles.card}>
            <GearItem gear={gear} onDataChanged={refreshData} />
          </div>
        ))}
      </div>

      <main className={styles.main}></main>

      <footer className={styles.footer}>
        <a href={`/api/logout`}>logout</a>
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
