// Ref: https://github.com/vvo/next-iron-session
// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';

// optionally add stronger typing for next-specific implementation
export type NextIronRequest = NextApiRequest & { session: Session };
export type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse
) => void | Promise<void> | Promise<any>;

const withSession = (handler: NextIronHandler) => {
  if (!process.env.SESSION_SECRET) {
    throw new Error('session: SESSION_SECRET not provided!');
  }

  return withIronSession(handler, {
    password: process.env.SESSION_SECRET,
    cookieName: 'gearalert',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
    ttl: 3600,
  });
};

export default withSession;
