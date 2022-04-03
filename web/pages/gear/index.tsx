import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { withSessionSsr } from '@/lib/session';
import Account, { AccountRecord } from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';
import Container from '@/components/layout/Container';
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
    <>
      <Container>
        <Head>
          <title>Gear Alert</title>
          <meta
            name="description"
            content="Get a notification to maintain your gear"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <p className={'welcome'}>Hello, {account.firstname}.</p>

        <div className={'options'}>
          We need your email to send you notifications:
          <div>
            <EmailField initialValue={account.email} onChange={saveEmail} />
          </div>
        </div>

        <div className={'grid'}>
          {gears.map((gear) => (
            <div key={gear.id} className={'card'}>
              <GearItem gear={gear} refreshData={refreshData} />
            </div>
          ))}
        </div>

        <footer>
          <a href={`/api/logout`}>logout</a>
        </footer>
      </Container>

      <style jsx>{`
        .welcome {
          line-height: 1.5;
          font-size: 1.5rem;
          text-align: center;
        }

        .options {
          text-align: center;
          color: #8c8c8c;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          margin-bottom: 3rem;
        }

        .card {
          margin: 1rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 100%;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </>
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
