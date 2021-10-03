import { findOne, updateMany, deleteMany } from '@/lib/db';

export interface GearItem {
  id: string;
  accountId: string;
  primary: boolean;
  name: string;
  retired: boolean;
  distance: number;
  gearType: string;
  lastChainAt?: number;
  lastTiresAt?: number;
  lastBrakePadsAt?: number;
  lastBrakeCablesAt?: number;
  lastGearCablesAt?: number;
}

class Account {
  _collection: string = 'gears';

  async findOne(filter: Partial<GearItem>): Promise<GearItem> {
    return findOne(this._collection, filter);
  }

  async save(item: Partial<GearItem>): Promise<GearItem | undefined> {
    if (!item.id) throw new Error(`Gear:save: Missing id!`);
    await updateMany(this._collection, item.id, item);
    return this.findOne({ id: item.id });
  }

  async saveAll(items: GearItem[]): Promise<void> {
    for (const item of items) {
      await updateMany(this._collection, item.id, item);
    }
  }

  async removeByNotIds(ids: string[]): Promise<void> {
    return deleteMany(this._collection, { id: { $nin: ids } });
  }
}

export default new Account();
