import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  // Save to global to use in teardown if you want
  (global as any).__MONGOD__ = mongod;
  process.env.MONGODB_URI = mongod.getUri(); // <-- ¡before loading AppModule!
}
