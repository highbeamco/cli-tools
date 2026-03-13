import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function listSheetsAction(spreadsheet: string) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const sheets = await client.listSheets(spreadsheetId);
  console.log(JSON.stringify({ spreadsheetId, sheets }, null, 2));
}
