// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
// see: https://github.com/vvo/iron-session
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from 'next';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

const sessionOptions = {
  password: process.env.SESSION_SECRET || '',
  cookieName: 'gearalert',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

if (!process.env.SESSION_SECRET) {
  throw new Error('session: SESSION_SECRET not provided!');
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    accountId?: string;
  }
}
