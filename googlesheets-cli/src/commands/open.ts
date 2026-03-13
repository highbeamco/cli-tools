import { SheetsClient } from "services/sheets-client";
import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function openAction(spreadsheet: string) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const metadata = await client.getMetadata(spreadsheetId);
  const sheets = (metadata.sheets ?? []).map((s) => ({
    title: s.properties?.title ?? "Untitled",
    rowCount: s.properties?.gridProperties?.rowCount ?? 0,
    columnCount: s.properties?.gridProperties?.columnCount ?? 0,
  }));

  console.log(
    JSON.stringify(
      {
        spreadsheetId,
        title: metadata.properties?.title ?? "Untitled Spreadsheet",
        sheetCount: sheets.length,
        sheets,
      },
      null,
      2,
    ),
  );
}
