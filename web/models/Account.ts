import * as uuid from 'uuid';
import { findOne, updateMany, deleteMany } from '@/lib/db';

export interface AccountItem {
  id: string;
  email: string;
  stravaId: number;
  stravaRefreshToken: string;
  stravaAccessToken: string;
  stravaTokenExpiresAt: number;
  username: string;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  sex: 'M' | 'F';
  profile_medium: string; // image url
  profile: string; // image url
  createdAt: number;
  updatedAt: number;
}

class Account {
  _collection: string = 'accounts';

  async findOne(filter: Partial<AccountItem>): Promise<AccountItem> {
    return findOne(this._collection, filter);
  }

  async save(item: Partial<AccountItem>): Promise<AccountItem> {
    if (!item.id) {
      item.id = uuid.v4();
      item.createdAt = Date.now();
    }
    item.updatedAt = Date.now();
    await updateMany(this._collection, item.id, item);
    return this.findOne({ id: item.id });
  }

  async removeById(id: string): Promise<void> {
    return deleteMany(this._collection, { id: { $in: [id] } });
  }
}

export default new Account();
