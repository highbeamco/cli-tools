import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function readAction(spreadsheet: string, range: string) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const values = await client.readRange(spreadsheetId, range);
  console.log(
    JSON.stringify(
      {
        range,
        values: values.map((row) => row.map(String)),
        rowCount: values.length,
        columnCount: values.length > 0 ? Math.max(...values.map((r) => r.length)) : 0,
      },
      null,
      2,
    ),
  );
}
