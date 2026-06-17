import mongoose, { Mongoose } from 'mongoose';

// Global type definition for cached connection
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Declare global to avoid TypeScript errors with globalThis
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseConnection | undefined;
}

// Initialize cache object
const cached: MongooseConnection = globalThis.mongooseCache ?? {
  conn: null,
  promise: null,
};

// Update global cache reference
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

/**
 * Connect to MongoDB and cache the connection to prevent multiple connections
 * during development. In production, each new instance will create a single connection.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing connection promise if in-flight
  if (cached.promise) {
    return cached.promise;
  }

  // Validate required environment variable
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // Create new connection promise
  cached.promise = mongoose
    .connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    .then((mongooseInstance) => {
      cached.conn = mongooseInstance;
      return mongooseInstance;
    });

  try {
    return await cached.promise;
  } catch (error) {
    // Reset cache on connection failure to allow retry
    cached.promise = null;
    throw error;
  }
}

/**
 * Disconnect from MongoDB. Useful for testing and cleanup.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
