import { resolve } from "node:path";
import { SheetsClient } from "services/sheets-client";

export function createClient(): SheetsClient {
  const credentialsPath =
    process.env.GOOGLE_CREDENTIALS_PATH ?? resolve(__dirname, "..", "..", "credentials.json");
  return new SheetsClient(credentialsPath);
}
