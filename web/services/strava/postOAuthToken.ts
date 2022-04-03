import axios from 'axios';
import settings from './settings.json';

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

type Body = {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token?: string;
  code?: string;
};

const postOAuthToken = async (
  code: string,
  grantType: string
): Promise<TokenResData | undefined> => {
  if (!process.env.STRAVA_CLIENT_SECRET) {
    throw new Error('postOAuthToken: STRAVA_CLIENT_SECRET not provided!');
  }

  const body: Body = {
    client_id: settings[process.env.NODE_ENV].clientId,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    grant_type: grantType,
  };

  if (grantType === 'refresh_token') {
    body.refresh_token = code;
  } else {
    body.code = code;
  }

  try {
    const res: any = await axios.post(
      `https://www.strava.com/oauth/token`,
      body
    );
    return res?.data || undefined;
  } catch (err: any) {
    throw new Error(`postOAuthToken: ${err.message}`);
  }
};

export default postOAuthToken;
