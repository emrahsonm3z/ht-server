import * as React from "react";
import { Email } from "../../../utils/emailService";
import Layout from "../../../mailTemplate/Layout";

interface Props {
  url: string;
}

const ConfirmationEmail: Email<Props> = ({ url }) => ({
  subject: `Hasta takip sistemine hoş geldiniz`,
  body: (
    <Layout title="Yeni üye">
      <div>
        <p>Lütfen email adresinizi onaylanıyınız:</p>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Aktive et
        </a>
      </div>
    </Layout>
  )
});

export default ConfirmationEmail;
