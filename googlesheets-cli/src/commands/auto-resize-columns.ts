import { parseSpreadsheetUrl } from "services/url-parser";
import { letterToColumn } from "services/a1-parser";
import { createClient } from "./shared";

export async function autoResizeColumnsAction(
  spreadsheet: string,
  opts: { sheet: string; start?: string; end?: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const sheetId = await client.resolveSheetId(spreadsheetId, opts.sheet);
  const startColumn = opts.start ?? "A";
  const endColumn = opts.end ?? "Z";
  const startIndex = letterToColumn(startColumn);
  const endIndex = letterToColumn(endColumn) + 1;

  await client.batchUpdate(spreadsheetId, [
    {
      autoResizeDimensions: {
        dimensions: {
          sheetId,
          dimension: "COLUMNS",
          startIndex,
          endIndex,
        },
      },
    },
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        message: `Auto-resized columns ${startColumn}–${endColumn} in "${opts.sheet}".`,
      },
      null,
      2,
    ),
  );
}
