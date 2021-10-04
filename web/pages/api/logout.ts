import withSession from '@/lib/session';

export default withSession(async (req, res) => {
  // Destroy session and return to Index page
  req.session.destroy();
  res.redirect('/');
});
