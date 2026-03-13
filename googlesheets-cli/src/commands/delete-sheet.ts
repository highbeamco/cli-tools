import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function deleteSheetAction(
  spreadsheet: string,
  sheetName: string,
  opts: { force?: boolean },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  if (!opts.force) {
    console.log(
      `Would permanently delete sheet "${sheetName}" and all its data. Pass --force to confirm.`,
    );
    return;
  }

  const sheetId = await client.resolveSheetId(spreadsheetId, sheetName);
  await client.batchUpdate(spreadsheetId, [{ deleteSheet: { sheetId } }]);

  console.log(JSON.stringify({ success: true, message: `Deleted sheet "${sheetName}".` }, null, 2));
}
