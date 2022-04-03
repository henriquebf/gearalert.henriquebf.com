import type { NextPage } from 'next';
import Head from 'next/head';
import { withSessionSsr } from '@/lib/session';
import Account from '@/models/Account';
import Container from '@/components/layout/Container';
import ConnectWithStrava from '@/components/buttons/ConnectWithStrava';

const IndexPage: NextPage = () => {
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

        <main className={'main'}>
          <h1 className={'title'}>Gear Alert</h1>

          <p className={'description'}>
            Get a notification to maintain your gear
          </p>

          <div className={'connect'}>
            <ConnectWithStrava />
          </div>
        </main>
      </Container>

      <style jsx>{`
        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          text-align: center;
        }

        .connect {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          margin-bottom: 3rem;
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
