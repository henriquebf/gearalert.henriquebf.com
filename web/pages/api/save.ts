import { withSessionRoute } from '@/lib/session';
import Account from '@/models/Account';
import Gear, { GearRecord } from '@/models/Gear';

export default withSessionRoute(async (req, res) => {
  if (
    typeof req.body?.gearId !== 'string' ||
    typeof req.body?.property !== 'string' ||
    typeof req.body?.value !== 'number'
  ) {
    // Invalid request
    return res.status(400).json({});
  }

  const accountId = req.session.accountId;
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
    [req.body?.property as keyof GearRecord]: req.body?.value,
  });

  res.status(200).json({});
});
