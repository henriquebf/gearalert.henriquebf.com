import axios from 'axios';

export const verifyToken = 'm25dYE2zRmBFRifZOC73';

const postPushSubscriptions = async (): Promise<void> => {
  console.log('postPushSubscriptions: subscribing...');
  const res = await axios.post(
    `https://www.strava.com/api/v3/push_subscriptions`,
    {
      client_id: '71939',
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      callback_url: 'https://gearalert.henriquebf.com/api/push',
      verify_token: verifyToken,
    }
  );
  console.log('postPushSubscriptions:', res);
};

export default postPushSubscriptions;
