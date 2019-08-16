import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import * as RateLimit from "express-rate-limit";
import * as RateLimitRedisStore from "rate-limit-redis";

import { redis } from "./redis";
import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";
import { redisSessionPrefix } from "./constants";
import { createTestConn } from "./testUtils/createTestConn";
import { logManager } from "./utils/logManager";
import { setupErrorHandling } from "./utils/shutdown";
import { getConnection } from "typeorm";

const logger = logManager();
logger.info("Loading environment...");

const SESSION_SECRET = process.env.SESSION_SECRET;
const RedisStore = connectRedis(session as any);

export const startServer = async () => {
  if (process.env.NODE_ENV === "test") {
    await redis.flushall();
  }

  logger.info("Creating GQL server...");
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"),
      session: request.session,
      req: request
    })
  });

  server.express.use((req, _, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
      try {
        const qid = authorization.split(" ")[1];
        req.headers.cookie = `qid=${qid}`;
      } catch (err) {
        // TODO
        throw err;
      }
    }

    return next();
  });

  server.express.use(
    new RateLimit({
      store: new RateLimitRedisStore({
        client: redis
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    })
  );

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
      prefix: redisSessionPrefix
    }),
    name: "qid",
    secret: SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  };

  server.express.use(session(sessionOption));

  server.express.set("trust proxy", 1);

  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === "test"
        ? "*"
        : (process.env.FRONTEND_HOST as string)
  };

  server.express.get("/confirm/:id", confirmEmail);

  logger.info("Connecting database...");
  if (process.env.NODE_ENV === "test") {
    await createTestConn(true);
  } else {
    await createTypeormConn();
  }

  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === "test" ? 0 : process.env.PORT
  });

  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  }

  setupErrorHandling({
    db: getConnection(),
    redisClient: redis,
    logger,
    graphqlServer: app
  });

  return app;
};
