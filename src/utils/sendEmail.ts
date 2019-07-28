import * as nodemailer from "nodemailer";

const from = '"Hasta takip" <info@hastatakip.com>';

const setup = async () => {
  const transport = await nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7fffc88f4cb247",
      pass: "a211444c5092f6"
    }
  });

  return transport;
};

export const sendConfirmationEmail = async (recipient: string, url: string) => {
  const transport = await setup();

  const email = {
    from,
    to: recipient,
    subject: "Hasta takip sistemine hoş geldiniz.",
    text: `
    Lütfen email adresinizi onaylanıyınız.

    ${url}
    `
  };

  await transport.sendMail(email);
};
