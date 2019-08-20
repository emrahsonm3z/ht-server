import * as passport from "passport";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import jwtStrategy, { UserPayload } from "./strategies/jwt";
import { User } from "../entity/User";
import { jwtConfig } from "./config";

passport.use("jwt", jwtStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  (async () => {
    try {
      const user = await User.findOne({ where: { _id: new ObjectId(id) } });
      done(null, user);
    } catch (error) {
      done(error);
    }
  })();
});

export default function auth() {
  passport.initialize();
  passport.session();
}

export function isAuthenticated() {
  return passport.authenticate("jwt");
}

// After autentication using one of the strategies, generate a JWT token
export const generateToken = async (user: UserPayload) => {
  await jwt.sign(
    {
      type: "user",
      data: {
        _id: user.data._id,
        email: user.data.email
      }
    },
    jwtConfig.secret,
    {
      expiresIn: 604800 // for 1 week time in milliseconds
    }
  );
};
