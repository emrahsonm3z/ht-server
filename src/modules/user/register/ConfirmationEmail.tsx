import * as React from "react";
import { Email } from "../../../utils/emailService";
import Layout from "../../../mailTemplate/Layout";

interface Props {
  firstName: string;
  lastName: string;
  url: string;
}

const ConfirmationEmail: Email<Props> = ({ firstName, lastName, url }) => ({
  subject: `Sayın ${firstName} ${lastName}, hasta takip sistemine hoş geldiniz`,
  body: (
    <Layout title={`${firstName} ${lastName}`}>
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
