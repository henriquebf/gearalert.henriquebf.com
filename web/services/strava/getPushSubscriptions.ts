import axios from 'axios';
import stravaSettings from '@/services/strava/settings.json';

const getPushSubscriptions = async (): Promise<void> => {
  try {
    const envStravaSettings = stravaSettings[process.env.NODE_ENV];
    const res = await axios.get(
      `https://www.strava.com/api/v3/push_subscriptions`,
      {
        params: {
          client_id: envStravaSettings.clientId,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
        },
      }
    );
  } catch (err: any) {
    throw new Error(`getPushSubscriptions: ${err.message}`);
  }
};

export default getPushSubscriptions;
