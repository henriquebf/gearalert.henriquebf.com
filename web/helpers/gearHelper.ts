import { GearData } from '@/services/strava/getAthlete';
import { GearRecord } from '@/models/Gear';

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
      primary: bike.primary,
      name: bike.name,
      retired: bike.retired,
      distance: bike.distance,
      gearType,
    }));
};

const maintenanceItems = [
  {
    key: 'lastChainAt',
    label: 'Chain',
    lifeDistance: 5000000,
  },
  {
    key: 'lastTiresAt',
    label: 'Tires',
    lifeDistance: 5000000,
  },
  {
    key: 'lastBrakePadsAt',
    label: 'Brake Pads',
    lifeDistance: 15000000,
  },
  {
    key: 'lastCablesAt',
    label: 'Cables and Fluids',
    lifeDistance: 10000000,
  },
];

export const populateMaintenanceItems = (gear: GearRecord) => {
  return maintenanceItems.map((i) => {
    let lastMaintenanceAt = gear[i.key as keyof GearRecord];
    if (typeof lastMaintenanceAt !== 'number') {
      lastMaintenanceAt = 0;
    }
    return {
      label: i.label,
      dueDistance: i.lifeDistance - (gear.distance - lastMaintenanceAt),
      lastMaintenanceAt,
    };
  });
};
