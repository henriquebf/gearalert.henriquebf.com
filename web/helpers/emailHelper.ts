import { GearRecord } from '@/models/Gear';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

// Filter a list of gear, all that maintenance is overdue

export const filterOverdueGear = (gears: GearRecord[]): GearRecord[] => {
  return gears
    .filter((gear) => gear.isNotificationEnabled)
    .filter(
      (gear) =>
        populateMaintenanceItems(gear).filter(
          (m) =>
            m.dueDistance < 0 && // maintenance item is overdue
            gear.distance !== gear.distanceLastNotification // not yet notified
        ).length
    );
};

// Generate content for notification email
export const generateNotificationContent = (gears: GearRecord[]): string => {
  // Prepare data for email template
  const preContent = gears.map((gear) => {
    const itemsToNotify = populateMaintenanceItems(gear)
      .map((i) => ({
        itemName: i.label,
        dueDistance: i.dueDistance,
      }))
      .filter((i) => i.dueDistance < 0);
    return {
      gearName: gear.name,
      itemsToNotify,
    };
  });

  // Generate template
  return preContent
    .map((p) => {
      const itemListStr = p.itemsToNotify
        .map(
          (i) =>
            `${i.itemName} is due for ${Math.abs(
              Math.floor(i.dueDistance / 1000)
            )} km`
        )
        .join('<br />');
      return `${p.gearName}:<br />${itemListStr}`;
    })
    .join('<br /><br />');
};
