import axios from 'axios';
import stravaSettings from '@/services/strava/settings.json';

export const verifyToken = 'm25dYE2zRmBFRifZOC73';

const postPushSubscriptions = async (): Promise<void> => {
  try {
    const envStravaSettings = stravaSettings[process.env.NODE_ENV];
    const res = await axios.post(
      `https://www.strava.com/api/v3/push_subscriptions`,
      {
        params: {
          client_id: envStravaSettings.clientId,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          callback_url: 'https://gearalert.henriquebf.com/api/push',
          verify_token: verifyToken,
        },
      }
    );
  } catch (err: any) {
    throw new Error(`postPushSubscriptions: ${err.message}`);
  }
};

export default postPushSubscriptions;
