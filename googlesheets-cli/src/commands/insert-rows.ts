import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function insertRowsAction(
  spreadsheet: string,
  opts: { sheet: string; row: string; count: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const rowNumber = parseInt(opts.row, 10);
  const count = parseInt(opts.count, 10);

  const sheetId = await client.resolveSheetId(spreadsheetId, opts.sheet);
  const startIndex = rowNumber - 1;

  await client.batchUpdate(spreadsheetId, [
    {
      insertDimension: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex,
          endIndex: startIndex + count,
        },
        inheritFromBefore: rowNumber > 1,
      },
    },
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        message: `Inserted ${count} blank row(s) before row ${rowNumber} in "${opts.sheet}".`,
      },
      null,
      2,
    ),
  );
}
