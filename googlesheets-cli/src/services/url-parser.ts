const SHEETS_URL_REGEX = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
const RAW_ID_REGEX = /^[a-zA-Z0-9-_]{20,}$/;

export const parseSpreadsheetUrl = (input: string): string => {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(SHEETS_URL_REGEX);
  if (urlMatch) return urlMatch[1];

  if (RAW_ID_REGEX.test(trimmed)) return trimmed;

  throw new Error(
    `Could not parse spreadsheet ID from: "${trimmed}"\n` +
      `Expected a Google Sheets URL like: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`,
  );
};
