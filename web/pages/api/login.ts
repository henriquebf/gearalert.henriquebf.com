// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withSession from '@/lib/session';
import Account from '@/models/Account';
import Gear from '@/models/Gear';
import postOAuthToken from 'services/strava/postOAuthToken';
import getAthlete from '@/services/strava/getAthlete';
import { generateGearFromAthlete } from '@/helpers/gearHelper';

export default withSession(async (req, res) => {
  try {
    if (typeof req.query?.code !== 'string') {
      throw new Error('oauth: code not provided!');
    }

    // Request tokens from Strava
    const data = await postOAuthToken(req.query.code, 'authorization_code');
    if (!data?.athlete?.id) {
      throw new Error('oauth: invalid token response!');
    }

    let account = await Account.findOne({ stravaId: data.athlete.id });
    if (!account) {
      // Create account
      account = await Account.save({
        email: '',
        stravaId: data.athlete.id,
        stravaRefreshToken: data.refresh_token,
        stravaAccessToken: data.access_token,
        stravaTokenExpiresAt: data.expires_at,
        username: data.athlete.username,
        firstname: data.athlete.firstname,
        lastname: data.athlete.lastname,
        bio: data.athlete.bio,
        city: data.athlete.city,
        state: data.athlete.state,
        country: data.athlete.country,
        sex: data.athlete.sex,
        profile_medium: data.athlete.profile_medium,
        profile: data.athlete.profile,
      });
    } else {
      // Update tokens
      account = await Account.save({
        id: account.id,
        stravaRefreshToken: data.refresh_token,
        stravaAccessToken: data.access_token,
        stravaTokenExpiresAt: data.expires_at,
      });
    }

    // Update Gear data
    const athlete = await getAthlete(account.stravaAccessToken);
    const gears = generateGearFromAthlete(account.id, 'bikes', athlete.bikes);
    const gearIds = gears.map((gear) => gear.id);
    await Gear.saveAll(gears);
    await Gear.removeByNotIds(gearIds);

    // Save session
    req.session.set('accountId', account.id);
    await req.session.save();

    res.redirect('/gear');
  } catch (err) {
    console.error(err);
    req.session.destroy();
    res.redirect('/');
  }
});
