import axios from 'axios';

const postPushSubscriptions = async (verifyToken: string): Promise<void> => {
  await axios.post(`https://www.strava.com/api/v3/push_subscriptions`, {
    client_id: '71939',
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    callback_url: 'https://gearalert.henriquebf.com/api/push',
    verify_token: verifyToken,
  });
};

export default postPushSubscriptions;
