import { parseSpreadsheetUrl } from "services/url-parser";
import { hexToSheetsColor, parseA1Range } from "services/a1-parser";
import { createClient } from "./shared";

export async function setBackgroundColorAction(
  spreadsheet: string,
  range: string,
  color: string,
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const parsed = parseA1Range(range);
  const sheetId = await client.resolveSheetId(spreadsheetId, parsed.sheetName);
  const sheetsColor = hexToSheetsColor(color);

  await client.batchUpdate(spreadsheetId, [
    {
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: parsed.startRow,
          endRowIndex: parsed.endRow,
          startColumnIndex: parsed.startCol,
          endColumnIndex: parsed.endCol,
        },
        cell: {
          userEnteredFormat: {
            backgroundColorStyle: { rgbColor: sheetsColor },
          },
        },
        fields: "userEnteredFormat.backgroundColorStyle",
      },
    },
  ]);

  console.log(
    JSON.stringify(
      { success: true, message: `Set background color of ${range} to ${color}.` },
      null,
      2,
    ),
  );
}
