import { find, findOne, updateMany, deleteMany } from '@/lib/db';

export interface GearRecord {
  id: string;
  accountId: string;
  isPrimary: boolean;
  name: string;
  retired: boolean;
  gearType: string;
  distance: number; // in meter
  distanceLastNotification?: number; // in meter
  isNotificationEnabled?: boolean;
  lastChainAt?: number;
  lastTiresAt?: number;
  lastBrakePadsAt?: number;
  lastCablesAt?: number;
}

class Gear {
  _collection: string = 'gears';

  async find(filter: Partial<GearRecord>): Promise<GearRecord[]> {
    return find(this._collection, filter, { distance: -1 });
  }

  async findOne(filter: Partial<GearRecord>): Promise<GearRecord> {
    return findOne(this._collection, filter);
  }

  async save(item: Partial<GearRecord>): Promise<GearRecord | undefined> {
    if (!item.id) throw new Error(`Gear:save: Missing id!`);
    await updateMany(this._collection, item.id, item);
    return this.findOne({ id: item.id });
  }

  async saveAll(items: GearRecord[]): Promise<void> {
    for (const item of items) {
      await updateMany(this._collection, item.id, item);
    }
  }

  async removeByNotIds(ids: string[]): Promise<void> {
    return deleteMany(this._collection, { id: { $nin: ids } });
  }
}

export default new Gear();
