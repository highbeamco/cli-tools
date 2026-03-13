import { parseSpreadsheetUrl } from "services/url-parser";
import { letterToColumn, parseA1Range } from "services/a1-parser";
import { createClient } from "./shared";

export async function sortRangeAction(
  spreadsheet: string,
  range: string,
  opts: { by: string[]; desc?: boolean },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const parsed = parseA1Range(range);
  const sheetId = await client.resolveSheetId(spreadsheetId, parsed.sheetName);
  const order = opts.desc ? "DESCENDING" : "ASCENDING";

  const sortSpecs = opts.by.map((col) => ({
    dimensionIndex: letterToColumn(col.toUpperCase()),
    sortOrder: order,
  }));

  await client.batchUpdate(spreadsheetId, [
    {
      sortRange: {
        range: {
          sheetId,
          startRowIndex: parsed.startRow,
          endRowIndex: parsed.endRow,
          startColumnIndex: parsed.startCol,
          endColumnIndex: parsed.endCol,
        },
        sortSpecs,
      },
    },
  ]);

  const sortDesc = opts.by.map((col) => `${col.toUpperCase()} ${order}`).join(", ");
  console.log(
    JSON.stringify({ success: true, message: `Sorted ${range} by ${sortDesc}.` }, null, 2),
  );
}
