import { GearData } from '@/services/strava/getAthlete';
import { GearRecord } from '@/models/Gear';

// Convert Athlete data received from Strava api to database format
export const generateGearFromAthlete = (
  accountId: string,
  gearType: string,
  athleteGears: GearData[]
) => {
  return athleteGears
    .filter((bike) => !bike.retired)
    .map((bike) => ({
      id: bike.id,
      accountId,
      isPrimary: bike.primary,
      name: bike.name,
      retired: bike.retired,
      distance: bike.distance,
      gearType,
    }));
};

// Login to determine how maitenance if due each for item, by crossing
// the total distance of the gear, last maintenance information and
// a definition of when each item should get changed
const maintenanceItems = [
  {
    property: 'lastChainAt',
    label: 'Chain',
    lifeDistance: 5000000,
  },
  {
    property: 'lastTiresAt',
    label: 'Tires',
    lifeDistance: 5000000,
  },
  {
    property: 'lastBrakePadsAt',
    label: 'Brake Pads',
    lifeDistance: 15000000,
  },
  {
    property: 'lastCablesAt',
    label: 'Cables/Fluids',
    lifeDistance: 10000000,
  },
];

export const populateMaintenanceItems = (gear: GearRecord) => {
  return maintenanceItems.map((i) => {
    let lastMaintenanceAt = gear[i.property as keyof GearRecord];
    if (typeof lastMaintenanceAt !== 'number') {
      lastMaintenanceAt = 0;
    }
    return {
      gearId: gear.id,
      accountId: gear.accountId,
      property: i.property,
      label: i.label,
      dueDistance: i.lifeDistance - (gear.distance - lastMaintenanceAt),
      lastMaintenanceAt,
    };
  });
};
