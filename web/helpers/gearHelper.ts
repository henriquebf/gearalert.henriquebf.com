import { GearData } from '@/services/strava/getAthlete';

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
