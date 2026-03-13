import { createClient } from "./shared";

export async function searchAction(query: string) {
  const client = createClient();
  const results = await client.searchDriveSpreadsheets(query);
  console.log(JSON.stringify({ results, totalResults: results.length }, null, 2));
}
