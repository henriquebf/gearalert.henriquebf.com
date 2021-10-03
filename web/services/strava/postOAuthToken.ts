import axios from 'axios';

type AthleteData = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: 'M' | 'F';
  profile_medium: string; // image url
  profile: string; // image url
};

type TokenResData = {
  token_type: 'Bearer';
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete?: AthleteData;
};

const postOAuthToken = async (
  code: string
): Promise<TokenResData | undefined> => {
  const res: any = await axios.post(`https://www.strava.com/oauth/token`, {
    client_id: '71939',
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
  });

  return res?.data || undefined;
};

export default postOAuthToken;
