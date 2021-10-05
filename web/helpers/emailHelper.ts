import { GearRecord } from '@/models/Gear';
import { populateMaintenanceItems } from '@/helpers/gearHelper';

// Generate content for notification email
export const generateNotificationContent = (gear: GearRecord[]): string => {
  // Prepare data for email template
  const preContent = gear.map((gear) => {
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
  const content = preContent
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

  return content;
};
