import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/Home.module.css';
import { withSessionSsr } from '@/lib/session';
import Account, { AccountRecord } from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';
import GearItem from '@/components/GearItem';
import EmailField from '@/components/form/EmailField';

type Props = { account: AccountRecord; gears: GearRecord[] };

const GearPage = ({ account, gears }: Props) => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const saveEmail = async (value: string) => {
    await axios.post('/api/email', {
      value,
    });
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

      <div className={styles.options}>
        We need your email to send you notifications:
        <div>
          <EmailField initialValue={account.email} onChange={saveEmail} />
        </div>
      </div>

      <div className={styles.grid}>
        {gears.map((gear) => (
          <div key={gear.id} className={styles.card}>
            <GearItem gear={gear} refreshData={refreshData} />
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <a href={`/api/logout`}>logout</a>
      </footer>
    </div>
  );
};

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}): Promise<{ props: any }> {
  const account = await Account.findOne({ id: req.session.accountId });
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
});

export default GearPage;
