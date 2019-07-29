import { ObjectId } from "mongodb";

import { ResolverMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { createMiddleware } from "../../../utils/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      User.findOne({
        where: { _id: new ObjectId(session.userId) }
      })
    )
  }
};
