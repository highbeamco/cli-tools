import { parseSpreadsheetUrl } from "services/url-parser";
import { columnToLetter } from "services/a1-parser";
import { createClient } from "./shared";

export async function searchCellsAction(
  spreadsheet: string,
  query: string,
  opts: { sheet?: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const tabs = opts.sheet
    ? [{ title: opts.sheet }]
    : await client.listSheets(spreadsheetId);

  const matches: Array<{ sheet: string; cell: string; value: string }> = [];
  const queryLower = query.toLowerCase();

  for (const tab of tabs) {
    try {
      const values = await client.readRange(spreadsheetId, `'${tab.title}'`);
      for (let row = 0; row < values.length; row++) {
        for (let col = 0; col < (values[row]?.length ?? 0); col++) {
          const cellValue = String(values[row][col] ?? "");
          if (cellValue.toLowerCase().includes(queryLower)) {
            matches.push({
              sheet: tab.title,
              cell: `${columnToLetter(col)}${row + 1}`,
              value: cellValue,
            });
          }
        }
      }
    } catch {
      // Skip sheets that can't be read
    }
  }

  console.log(
    JSON.stringify({ matches: matches.slice(0, 50), totalMatches: matches.length }, null, 2),
  );
}
