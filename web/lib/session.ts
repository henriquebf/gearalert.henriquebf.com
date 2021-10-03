// Ref: https://github.com/vvo/next-iron-session
// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { Session, withIronSession } from 'next-iron-session';

// optionally add stronger typing for next-specific implementation
type NextIronRequest = NextApiRequest & { session: Session };
type ServerSideContext = GetServerSidePropsContext & {
  req: NextIronRequest;
};

export type ApiHandler = (
  req: NextIronRequest,
  res: NextApiResponse
) => void | Promise<void> | Promise<any>;

export type ServerSideHandler = (
  context: ServerSideContext
) => ReturnType<GetServerSideProps>;

if (!process.env.SESSION_SECRET) {
  throw new Error('session: SESSION_SECRET not provided!');
}

const withSession = <T extends ApiHandler | ServerSideHandler>(handler: T) =>
  withIronSession(handler, {
    password: process.env.SESSION_SECRET || '',
    cookieName: 'gearalert',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
  });

export default withSession;
