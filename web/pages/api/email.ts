import { withSessionRoute } from '@/lib/session';
import Account from '@/models/Account';

export default withSessionRoute(async (req, res) => {
  if (typeof req.body?.value !== 'string') {
    // Invalid request
    return res.status(400).json({});
  }

  const accountId = req.session.accountId;
  const account = await Account.findOne({ id: accountId });
  if (!account) {
    // Unauthorized
    return res.status(401).json({});
  }

  // Save data submitted by user
  await Account.save({
    ...account,
    email: req.body?.value,
  });

  res.status(200).json({});
});
