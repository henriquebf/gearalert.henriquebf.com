import { withSessionRoute } from '@/lib/session';

export default withSessionRoute(async (req, res) => {
  // Destroy session and return to Index page
  req.session.destroy();
  res.redirect('/');
});
