// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withSession from '@/lib/session';

export default withSession(async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
