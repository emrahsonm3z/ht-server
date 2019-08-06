import * as React from "react";

const bodyStyle = {
  width: "100%",
  margin: 0,
  padding: 0,
  WebkitTextSizeAdjust: "100%",
  MsTextSizeAdjust: "100%"
};

const headerStyle = {
  color: "red"
};

interface Props {
  title: string;
}

const Layout: React.FC<Props> = ({ title, children }) => (
  <html lang="tr">
    <head>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </head>
    <body style={bodyStyle}>
      <h1 style={headerStyle}>{title}</h1>
      <div>
        {children}
        <p>hastatakip.com ekibi</p>
      </div>
    </body>
  </html>
);

export default Layout;
