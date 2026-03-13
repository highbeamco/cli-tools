import { parseSpreadsheetUrl } from "services/url-parser";
import { parseA1Range } from "services/a1-parser";
import { createClient } from "./shared";

export async function mergeCellsAction(
  spreadsheet: string,
  range: string,
  opts: { type?: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const parsed = parseA1Range(range);
  const sheetId = await client.resolveSheetId(spreadsheetId, parsed.sheetName);
  const mergeType = opts.type ?? "MERGE_ALL";

  await client.batchUpdate(spreadsheetId, [
    {
      mergeCells: {
        range: {
          sheetId,
          startRowIndex: parsed.startRow,
          endRowIndex: parsed.endRow,
          startColumnIndex: parsed.startCol,
          endColumnIndex: parsed.endCol,
        },
        mergeType,
      },
    },
  ]);

  console.log(
    JSON.stringify(
      { success: true, message: `Merged cells in ${range} (${mergeType}).` },
      null,
      2,
    ),
  );
}
