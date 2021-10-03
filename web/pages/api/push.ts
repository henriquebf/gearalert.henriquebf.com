import { NextApiRequest, NextApiResponse } from 'next';
import postPushSubscriptions, {
  verifyToken,
} from '@/services/strava/postPushSubscriptions';

let hasSubscribed = false;

type Data =
  | {}
  | {
      'hub.challenge': string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Start push notifications
  if (process.env.NODE_ENV === 'production' && !hasSubscribed) {
    postPushSubscriptions();
    hasSubscribed = true;
  }

  // Confirm subscribe to strava
  if (
    req.query?.['hub.verify_token'] === verifyToken &&
    req.query?.['hub.mode'] === 'subscribe' &&
    req.query?.['hub.challenge']
  ) {
    console.log(`api/push: responding hub (${req.query?.['hub.challenge']})`);
    return res
      .status(200)
      .json({ 'hub.challenge': req.query?.['hub.challenge'] });
  }

  // Execute push
  console.log(`api/push: receiving push...`, req.query);
  // WIP
  res.status(200).json({});
}
