import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/services/strava/postPushSubscriptions';
import postOAuthToken from 'services/strava/postOAuthToken';
import getAthlete from '@/services/strava/getAthlete';
import Account, { AccountRecord } from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';
import {
  generateGearFromAthlete,
  populateMaintenanceItems,
} from '@/helpers/gearHelper';
import { validateEmailAddress } from '@/helpers/stringHelper';

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
    const gearIds = gears.map((gear) => gear.id);
    await Gear.saveAll(gears);
    await Gear.removeByNotIds(gearIds);
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
  const overdueGear = gears
    .filter((gear) => gear.isNotificationEnabled)
    .filter(
      (gear) =>
        populateMaintenanceItems(gear).filter(
          (m) =>
            m.dueDistance < 0 && // maintenance item is overdue
            gear.distance !== gear.distanceLastNotification // not yet notified
        ).length
    );

  // Prepare data for email template
  const preTemplate = overdueGear.map((gear) => {
    const itemsToNotify = populateMaintenanceItems(gear)
      .map((i) => ({
        itemName: i.label,
        dueDistance: i.dueDistance,
      }))
      .filter((i) => i.dueDistance < 0);
    return {
      gearName: gear.name,
      itemsToNotify,
    };
  });

  // Generate template
  const template = preTemplate
    .map((p) => {
      const itemListStr = p.itemsToNotify
        .map(
          (i) =>
            `<b>${i.itemName}</b> is due for ${Math.abs(
              Math.floor(i.dueDistance / 1000)
            )} km`
        )
        .join('<br />');
      return `${p.gearName}:<br />${itemListStr}`;
    })
    .join('<br /><br />');

  console.log(template);
};
