import * as redisClient from "ioredis";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import * as pino from "pino";
import { Connection } from "typeorm";

// that all logging gets performed before process exit.
const shutdown = async (config: ShutdownOptions): Promise<void> => {
  config.logger.warn("Shutting down HTTP server.");
  config.graphqlServer.close(() => {
    config.logger.warn("HTTP server closed.");
    config.redisClient.disconnect();
    config.logger.warn("Redis disconnected.");

    config.db.close().then(() => {
      config.logger.warn("Database disconnected.");
      const finalLogger = pino.final(config.logger);
      finalLogger.warn("Bye.");
      process.exit(1);
    });
  });
};

export interface ShutdownOptions {
  db: Connection;
  redisClient: redisClient.Redis;
  logger: pino.Logger;
  graphqlServer: HttpServer | HttpsServer;
}

export const setupErrorHandling = (config: ShutdownOptions): void => {
  process.on("uncaughtException", err => {
    config.logger.error(err, "Uncaught Exception");
    shutdown(config);
  });
  // TODO
  process.on("unhandledRejection", (err: any) => {
    config.logger.error(err, "Uncaught Rejection");
    shutdown(config);
  });
  process.on("SIGINT", async () => {
    config.logger.warn("Node process terminated via SIGINT...");
    shutdown(config);
  });
};
