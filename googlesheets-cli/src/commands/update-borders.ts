import { parseSpreadsheetUrl } from "services/url-parser";
import { hexToSheetsColor, parseA1Range } from "services/a1-parser";
import { createClient } from "./shared";

export async function updateBordersAction(
  spreadsheet: string,
  range: string,
  opts: { style?: string; color?: string; sides?: string },
) {
  const client = createClient();
  const spreadsheetId = parseSpreadsheetUrl(spreadsheet);

  const parsed = parseA1Range(range);
  const sheetId = await client.resolveSheetId(spreadsheetId, parsed.sheetName);
  const style = opts.style ?? "SOLID";
  const color = opts.color ?? "#000000";
  const sides = opts.sides ?? "all";
  const sheetsColor = hexToSheetsColor(color);

  const border = {
    style,
    colorStyle: { rgbColor: sheetsColor },
  };

  type BorderSpec = {
    top?: typeof border;
    bottom?: typeof border;
    left?: typeof border;
    right?: typeof border;
    innerHorizontal?: typeof border;
    innerVertical?: typeof border;
  };

  const borders: BorderSpec = {};

  switch (sides) {
    case "all":
      borders.top = border;
      borders.bottom = border;
      borders.left = border;
      borders.right = border;
      borders.innerHorizontal = border;
      borders.innerVertical = border;
      break;
    case "outer":
      borders.top = border;
      borders.bottom = border;
      borders.left = border;
      borders.right = border;
      break;
    case "inner":
      borders.innerHorizontal = border;
      borders.innerVertical = border;
      break;
    case "top":
      borders.top = border;
      break;
    case "bottom":
      borders.bottom = border;
      break;
    case "left":
      borders.left = border;
      break;
    case "right":
      borders.right = border;
      break;
  }

  await client.batchUpdate(spreadsheetId, [
    {
      updateBorders: {
        range: {
          sheetId,
          startRowIndex: parsed.startRow,
          endRowIndex: parsed.endRow,
          startColumnIndex: parsed.startCol,
          endColumnIndex: parsed.endCol,
        },
        ...borders,
      },
    },
  ]);

  console.log(
    JSON.stringify(
      {
        success: true,
        message: `Applied ${style} ${color} borders (${sides}) to ${range}.`,
      },
      null,
      2,
    ),
  );
}
