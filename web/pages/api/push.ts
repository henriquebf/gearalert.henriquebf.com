import { NextApiRequest, NextApiResponse } from 'next';
import stravaSettings from '@/services/strava/settings.json';
import postPushSubscriptions from '@/services/strava/postPushSubscriptions';

// Start push notifications
const verifyToken = 'm25dYE2zRmBFRifZOC73';
if (process.env.NODE_ENV === 'production') {
  console.log(`api/push: subscribing...`);
  postPushSubscriptions(verifyToken);
}

type Data =
  | {}
  | {
      'hub.challenge': string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Check validation from Strava
  const stravaEnvSettings = stravaSettings[process.env.NODE_ENV];
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
  console.log(
    `api/push: receiving push for ${req.query?.owner_id}/${req.query?.object_type}`
  );
  // WIP
  res.status(200).json({});
}
