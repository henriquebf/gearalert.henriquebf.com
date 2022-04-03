import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/services/strava/postPushSubscriptions';
import postOAuthToken from 'services/strava/postOAuthToken';
import getAthlete from '@/services/strava/getAthlete';
import Account, { AccountRecord } from '@/models/Account';
import Gear from '@/models/Gear';
import postWithTemplate from '@/services/postmark/postTemplate';
import { generateGearFromAthlete } from '@/helpers/gearHelper';
import { validateEmailAddress } from '@/helpers/stringHelper';
import { filterOverdueGear } from '@/helpers/emailHelper';
import { generateNotificationContent } from '@/helpers/emailHelper';

type Data =
  | {}
  | {
      'hub.challenge': string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Respond to Strava, if confirming subscription
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

  // Execute user push
  console.log(`api/push: receiving push for ${req.body.owner_id}...`);
  let account = await Account.findOne({ stravaId: Number(req.body.owner_id) });
  if (account) {
    // Check/Update access token
    if (account.stravaTokenExpiresAt < Date.now() / 1000) {
      const data = await postOAuthToken(
        account.stravaRefreshToken,
        'refresh_token'
      );
      if (!data?.access_token) {
        throw new Error('api/push: invalid token response!');
      }
      account = await Account.save({
        id: account.id,
        stravaAccessToken: data.access_token,
      });
    }

    // Update Gear data
    const athlete = await getAthlete(account.stravaAccessToken);
    const gears = generateGearFromAthlete(account.id, 'bikes', athlete.bikes);
    await Gear.saveAll(gears);
    console.log(`api/push: updated data for ${req.body.owner_id}.`);

    // Check/Send email notifications (async)
    executeNotifications(account);
  } else {
    console.error(`api/push: account not found!`);
  }

  res.status(200).json({});
}

const executeNotifications = async (account: AccountRecord) => {
  if (!validateEmailAddress(account.email)) return;

  // Find gear that requires notification
  const gears = await Gear.find({ accountId: account.id });

  // Separate gear items with overdue maintenance
  const overdueGear = filterOverdueGear(gears);
  if (overdueGear.length === 0) return;

  // Generate email content
  const postmarkList = generateNotificationContent(overdueGear);

  // Send email
  await postWithTemplate(account.email, postmarkList);

  // Acknowlege notification
  const updatedGear = gears.map((gear) => ({
    ...gear,
    distanceLastNotification: gear.distance,
  }));
  await Gear.saveAll(updatedGear);
};
