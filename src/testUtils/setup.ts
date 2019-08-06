import { startServer } from "../startServer";
import { AddressInfo } from "net";

export const setup = async () => {
  const app = await startServer();
  const { port }: any = app.address() as AddressInfo;
  process.env.TEST_HOST = `http://127.0.0.1:${port}`;

  console.log(`\nTest server is running on ${process.env.TEST_HOST}`);
};
