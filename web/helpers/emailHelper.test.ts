import { GearRecord } from '@/models/Gear';
import { filterOverdueGear } from './emailHelper';

describe('filterOverdueGear', () => {
  const newBike: GearRecord = {
    id: 'xxx1',
    accountId: 'xxx1',
    isPrimary: true,
    name: 'Test 1',
    retired: false,
    gearType: 'bike',
    distance: 0, // never used
    distanceLastNotification: 0,
    isNotificationEnabled: true,
    lastChainAt: 0,
    lastTiresAt: 0,
    lastBrakePadsAt: 0,
    lastCablesAt: 0,
  };

  const dueBike = {
    id: 'xxx2',
    accountId: 'xxx2',
    isPrimary: true,
    name: 'Test 2',
    retired: false,
    gearType: 'bike',
    distance: 6000000, // overdue
    distanceLastNotification: 0,
    isNotificationEnabled: true,
    lastChainAt: 0,
    lastTiresAt: 0,
    lastBrakePadsAt: 0,
    lastCablesAt: 0,
  };

  const maintainedBike = {
    id: 'xxx3',
    accountId: 'xxx3',
    isPrimary: true,
    name: 'Test 3',
    retired: false,
    gearType: 'bike',
    distance: 6000000,
    distanceLastNotification: 0,
    isNotificationEnabled: true,
    lastChainAt: 5000000, // maintained
    lastTiresAt: 5000000, // maintained
    lastBrakePadsAt: 5000000, // maintained
    lastCablesAt: 5000000, // maintained
  };

  it('empty input', () => {
    const input: GearRecord[] = [];
    const filteredGears = filterOverdueGear(input);
    expect(filteredGears).toEqual([]);
  });

  it('adds a bike that was never maintained but it is new', () => {
    const input: GearRecord[] = [newBike];
    const filteredGears = filterOverdueGear(input);
    expect(filteredGears).toEqual([]);
  });

  it('adds a bike that was never maintained and it is due', () => {
    const input: GearRecord[] = [newBike, dueBike];
    const filteredGears = filterOverdueGear(input);
    expect(filteredGears).toEqual([dueBike]);
  });

  it('adds a bike that was maintained so it is not due', () => {
    const input: GearRecord[] = [newBike, maintainedBike];
    const filteredGears = filterOverdueGear(input);
    expect(filteredGears).toEqual([]);
  });
});
