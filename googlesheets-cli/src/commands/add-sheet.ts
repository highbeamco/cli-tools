import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function addSheetAction(
  spreadsheet: string,
  name: string,
  opts: { rows?: string; cols?: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const rowCount = opts.rows ? parseInt(opts.rows, 10) : 1000;
  const columnCount = opts.cols ? parseInt(opts.cols, 10) : 26;

  const result = await client.batchUpdate(spreadsheetId, [
    {
      addSheet: {
        properties: {
          title: name,
          gridProperties: { rowCount, columnCount },
        },
      },
    },
  ]);

  const newSheetId = result.replies?.[0]?.addSheet?.properties?.sheetId ?? 0;

  console.log(
    JSON.stringify(
      {
        success: true,
        name,
        sheetId: newSheetId,
        message: `Created new sheet "${name}" (${rowCount} rows x ${columnCount} columns).`,
      },
      null,
      2,
    ),
  );
}
