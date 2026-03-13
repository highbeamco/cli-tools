import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function deleteRowsAction(
  spreadsheet: string,
  opts: { sheet: string; row: string; count: string; force?: boolean },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);
  const rowNumber = parseInt(opts.row, 10);
  const count = parseInt(opts.count, 10);

  if (!opts.force) {
    console.log(
      `Would delete ${count} row(s) starting at row ${rowNumber} in "${opts.sheet}". Pass --force to confirm.`,
    );
    return;
  }

  const sheetId = await client.resolveSheetId(spreadsheetId, opts.sheet);
  const startIndex = rowNumber - 1;

  await client.batchUpdate(spreadsheetId, [
    {
      deleteDimension: {
        range: {
          sheetId,
          dimension: "ROWS",
          startIndex,
          endIndex: startIndex + count,
        },
      },
    },
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        message: `Deleted ${count} row(s) starting at row ${rowNumber} in "${opts.sheet}".`,
      },
      null,
      2,
    ),
  );
}
