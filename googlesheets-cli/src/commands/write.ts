import { parseSpreadsheetUrl } from "services/url-parser";
import { createClient } from "./shared";

export async function writeAction(
  spreadsheet: string,
  range: string,
  opts: { data?: string; raw?: boolean },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  if (!opts.data) {
    console.error('Error: --data is required. Pass a JSON 2D array, e.g. \'[["a","b"],["c","d"]]\'');
    process.exit(1);
  }

  let values: string[][];
  try {
    values = JSON.parse(opts.data);
  } catch {
    console.error("Error: --data must be valid JSON (a 2D array of strings).");
    process.exit(1);
  }

  const valueInputOption = opts.raw ? "RAW" : "USER_ENTERED";
  await client.writeRange(spreadsheetId, range, values, valueInputOption);

  const rowCount = values.length;
  const colCount = Math.max(0, ...values.map((r) => r.length));
  console.log(
    JSON.stringify(
      {
        success: true,
        range,
        rowCount,
        colCount,
        valueInputOption,
        message: `Wrote ${rowCount} rows x ${colCount} cols to ${range}.`,
      },
      null,
      2,
    ),
  );
}
