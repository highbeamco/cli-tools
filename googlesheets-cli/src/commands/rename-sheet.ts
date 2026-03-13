import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function renameSheetAction(
  spreadsheet: string,
  opts: { from: string; to: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const sheetId = await client.resolveSheetId(spreadsheetId, opts.from);
  await client.batchUpdate(spreadsheetId, [
    {
      updateSheetProperties: {
        properties: { sheetId, title: opts.to },
        fields: "title",
      },
    },
  ]);

  console.log(
    JSON.stringify(
      { success: true, message: `Renamed sheet "${opts.from}" to "${opts.to}".` },
      null,
      2,
    ),
  );
}
