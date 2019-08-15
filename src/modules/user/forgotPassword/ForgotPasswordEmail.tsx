import * as React from "react";
import { Email } from "../../../utils/emailService";
import Layout from "../../../mailTemplate/Layout";

interface Props {
  url: string;
}

const ForgotPasswordEmail: Email<Props> = ({ url }) => ({
  subject: `Hasta Takip sistemi şifrenizi yenileme`,
  body: (
    <Layout title="Şifre sıfırlama">
      <div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Şifreni sıfırla
        </a>
      </div>
    </Layout>
  )
});

export default ForgotPasswordEmail;
