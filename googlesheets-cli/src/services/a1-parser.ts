/** Convert a 0-indexed column number to a letter (0 → "A", 25 → "Z", 26 → "AA"). */
export const columnToLetter = (col: number): string => {
  let result = "";
  let c = col;
  while (c >= 0) {
    result = String.fromCharCode((c % 26) + 65) + result;
    c = Math.floor(c / 26) - 1;
  }
  return result;
};

/** Convert a column letter to a 0-indexed number ("A" → 0, "Z" → 25, "AA" → 26). */
export const letterToColumn = (letter: string): number => {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.charCodeAt(i) - 64);
  }
  return result - 1;
};

export interface ParsedA1Range {
  sheetName: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export const parseA1Range = (range: string): ParsedA1Range => {
  const bangIdx = range.lastIndexOf("!");
  if (bangIdx === -1) {
    throw new Error(
      `Invalid A1 range "${range}": must include sheet name (e.g. "'Sheet1'!A1:D10")`,
    );
  }

  let sheetName = range.slice(0, bangIdx);
  const cellRange = range.slice(bangIdx + 1);

  if (sheetName.startsWith("'") && sheetName.endsWith("'")) {
    sheetName = sheetName.slice(1, -1);
  }

  const parts = cellRange.split(":");
  if (parts.length !== 2) {
    throw new Error(`Invalid A1 range "${range}": expected format like "A1:D10"`);
  }

  const parseCell = (cell: string) => {
    const match = cell.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
      throw new Error(`Invalid cell reference "${cell}" in range "${range}"`);
    }
    return {
      col: letterToColumn(match[1]),
      row: Number(match[2]) - 1,
    };
  };

  const start = parseCell(parts[0]);
  const end = parseCell(parts[1]);

  return {
    sheetName,
    startRow: start.row,
    startCol: start.col,
    endRow: end.row + 1,
    endCol: end.col + 1,
  };
};

export interface SheetsColor {
  red: number;
  green: number;
  blue: number;
}

export const hexToSheetsColor = (hex: string): SheetsColor => {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length !== 6) {
    throw new Error(`Invalid hex color "${hex}": expected #RRGGBB format`);
  }
  return {
    red: parseInt(cleaned.slice(0, 2), 16) / 255,
    green: parseInt(cleaned.slice(2, 4), 16) / 255,
    blue: parseInt(cleaned.slice(4, 6), 16) / 255,
  };
};
