import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function duplicateSheetAction(
  spreadsheet: string,
  opts: { source: string; name: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const sourceSheetId = await client.resolveSheetId(spreadsheetId, opts.source);
  const result = await client.batchUpdate(spreadsheetId, [
    { duplicateSheet: { sourceSheetId, newSheetName: opts.name } },
  ]);

  const newSheetId = result.replies?.[0]?.duplicateSheet?.properties?.sheetId ?? 0;

  console.log(
    JSON.stringify(
      {
        success: true,
        newSheetId,
        message: `Duplicated "${opts.source}" as "${opts.name}".`,
      },
      null,
      2,
    ),
  );
}
