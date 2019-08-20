import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback
} from "passport-jwt";
import { ObjectId } from "mongodb";

import { User } from "../../entity/User";
import { jwtConfig } from "../config";

export interface UserPayload {
  data: {
    _id: string;
    email: string;
  };
}

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: jwtConfig.secret
};

export default new JwtStrategy(
  jwtOptions,
  async (jwtPayload: UserPayload, done: VerifiedCallback) => {
    await User.findOne({
      where: { _id: new ObjectId(jwtPayload.data._id) }
    })
      .then(user => {
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      })
      .catch(err => done(err, false));
  }
);
