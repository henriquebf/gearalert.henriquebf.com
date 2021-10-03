// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withSession from '@/lib/session';
import Account from '@/models/Account';
import postOAuthToken from 'services/strava/postOAuthToken';

export default withSession(async (req, res) => {
  try {
    if (typeof req.query?.code !== 'string') {
      throw new Error('oauth: code not provided!');
    }

    const data = await postOAuthToken(req.query.code);
    if (!data?.athlete?.id) {
      throw new Error('oauth: invalid token response!');
    }

    let account = await Account.findOne({ stravaId: data.athlete.id });
    if (!account) {
      const newAccount = {
        email: '',
        stravaId: data.athlete.id,
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
      };
      account = await Account.save(newAccount);
    }

    req.session.set('accountId', account.id);
    await req.session.save();

    res.redirect('/gear');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});
