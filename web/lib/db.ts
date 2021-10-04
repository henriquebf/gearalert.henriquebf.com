// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb';

const dbName = 'v1';
const uri = process.env.MONGODB_URI ?? '';
const options: any = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

if (!process.env.MONGODB_URI) {
  throw new Error('db: MONGODB_URI was not exported!');
}

const clientObject = new MongoClient(uri, options);
const clientPromise = clientObject.connect();

interface AnyObject {
  [key: string]: any;
}

export const findOne = async (
  collection: string,
  filter: AnyObject
): Promise<any | undefined> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db(dbName)
      .collection(collection)
      .findOne(filter, { projection: { _id: 0 } }, (err, record) => {
        if (err) throw new Error(`db:findOne: Failed for ${collection}!`);
        resolve(record ?? undefined);
      });
  });
};

export const find = async (
  collection: string,
  filter?: AnyObject,
  sort?: AnyObject,
  offset?: number,
  limit?: number
): Promise<any[]> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db(dbName)
      .collection(collection)
      .find(filter ?? {}, { projection: { _id: 0 } })
      .skip(offset ?? 0)
      .limit(limit ?? 999999)
      .sort(sort ?? { updatedAt: -1 })
      .toArray((err, records) => {
        if (err) throw new Error(`db:find: Failed for ${collection}!`);
        resolve(records ?? []);
      });
  });
};

export const updateMany = async (
  collection: string,
  filter: AnyObject,
  properties: AnyObject
): Promise<void> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db(dbName)
      .collection(collection)
      .updateMany(filter, { $set: properties }, { upsert: true }, (err) => {
        if (err) throw new Error(`db:updateMany: Failed for ${collection}!`);
        resolve();
      });
  });
};

export const deleteMany = async (
  collection: string,
  filter: AnyObject
): Promise<void> => {
  return new Promise(async (resolve) => {
    const client = await clientPromise;
    client
      .db(dbName)
      .collection(collection)
      .deleteMany(filter, (err) => {
        if (err) throw new Error(`db:deleteMany: Failed for ${collection}!`);
        return resolve();
      });
  });
};
