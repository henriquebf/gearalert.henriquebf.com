import withSession from '@/lib/session';
import Account from '@/models/Account';
import Gear from '@/models/Gear';

export default withSession(async (req, res) => {
  if (
    typeof req.body?.gearId !== 'string' ||
    typeof req.body?.value !== 'boolean'
  ) {
    // Invalid request
    return res.status(400).json({});
  }

  const accountId = req.session.get('accountId');
  const account = await Account.findOne({ id: accountId });
  if (!account) {
    // Unauthorized
    return res.status(401).json({});
  }

  const gear = await Gear.findOne({ id: req.body?.gearId, accountId });
  if (!gear) {
    // Not found
    return res.status(404).json({});
  }

  // Save data submitted by user
  await Gear.save({
    ...gear,
    isNotificationEnabled: req.body?.value,
  });

  res.status(200).json({});
});
