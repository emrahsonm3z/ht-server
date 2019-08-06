import { Redis } from "ioredis";
import { removeAllUserSessions } from "../../../utils/removeAllUserSessions";
import { User } from "../../../entity/User";
import { ObjectId } from "mongodb";

export const forgotPasswordLockAccount = async (
  userId: string,
  redis: Redis
) => {
  // can't login
  await User.update(
    { id: new ObjectId(userId) },
    { forgotPasswordLocked: true }
  );

  // remove all session
  await removeAllUserSessions(userId, redis);
};
