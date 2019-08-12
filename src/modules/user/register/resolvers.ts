import * as yup from "yup";

import { ResolverMap } from "../../../types/graphql-utils";
import { User } from "../../../entity/User";
import { formatYupError } from "../../../utils/formatYupError";
import { duplicateEmail } from "./errorMessages";
import {
  registerPasswordValidation,
  emailValidation
} from "../../../yupSchemas";
import mailer from "../../../utils/sendEmail";
import { createConfirmEmailLink } from "./createConfirmEmailLink";

const schema = yup.object().shape({
  email: emailValidation,
  password: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyExists) {
        return [
          {
            path: "email",
            message: duplicateEmail
          }
        ];
      }

      const user = User.create({
        email,
        password
      });

      await user.save();

      mailer.send(
        "confirmationEmail",
        {
          url: await createConfirmEmailLink(url, user.id.toString(), redis)
        },
        { to: email }
      );

      return null;
    }
  }
};
