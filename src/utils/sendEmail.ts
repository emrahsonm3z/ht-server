import Mailer from "./emailService";
import emailTemplateList from "../mailTemplate";

const isProd = process.env.NODE_ENV === "production";

const mailerConfig = {
  defaults: {
    from: {
      name: isProd
        ? (process.env.EMAIL_FROM_NAME as string)
        : (process.env.EMAIL_TEST_FROM_NAME as string),
      address: isProd
        ? (process.env.EMAIL_FROM_ADDRESS as string)
        : (process.env.EMAIL_TEST_FROM_ADDRESS as string)
    }
  },
  transport: {
    host: isProd
      ? (process.env.EMAIL_HOST as string)
      : (process.env.EMAIL_TEST_HOST as string),
    port: isProd
      ? (process.env.EMAIL_PORT as number | undefined)
      : (process.env.EMAIL_TEST_PORT as number | undefined),
    auth: {
      user: isProd
        ? (process.env.EMAIL_USER as string)
        : (process.env.EMAIL_TEST_USER as string),
      pass: isProd
        ? (process.env.EMAIL_PASS as string)
        : (process.env.EMAIL_TEST_PASS as string)
    }
    // secure: false,
    // tls: {
    //   rejectUnauthorized: false
    // },
    // debug: true, // show debug output
    // logger: true // log information in console
  }
};

const mailer = Mailer(mailerConfig, emailTemplateList);

export default mailer;
