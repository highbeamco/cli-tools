import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { google, type sheets_v4 } from "googleapis";

export class SheetsClient {
  private client: sheets_v4.Sheets | null = null;
  private readonly credentialsPath: string;

  constructor(credentialsPath: string) {
    this.credentialsPath = resolve(credentialsPath);
    if (!existsSync(this.credentialsPath)) {
      throw new Error(
        `Google credentials file not found at ${this.credentialsPath}. ` +
          `Download a service account key from the GCP console and place it there.`,
      );
    }
  }

  private getClient(): sheets_v4.Sheets {
    if (this.client) return this.client;

    const auth = new google.auth.GoogleAuth({
      keyFile: this.credentialsPath,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    this.client = google.sheets({ version: "v4", auth });
    return this.client;
  }

  async getMetadata(spreadsheetId: string) {
    const client = this.getClient();
    const response = await client.spreadsheets.get({
      spreadsheetId,
      fields: "properties.title,sheets.properties",
    });
    return response.data;
  }

  async listSheets(spreadsheetId: string) {
    const metadata = await this.getMetadata(spreadsheetId);
    return (metadata.sheets ?? []).map((sheet) => ({
      title: sheet.properties?.title ?? "Untitled",
      sheetId: sheet.properties?.sheetId ?? 0,
      rowCount: sheet.properties?.gridProperties?.rowCount ?? 0,
      columnCount: sheet.properties?.gridProperties?.columnCount ?? 0,
    }));
  }

  async readRange(spreadsheetId: string, range: string): Promise<string[][]> {
    const client = this.getClient();
    const response = await client.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: "FORMATTED_VALUE",
    });
    return (response.data.values ?? []) as string[][];
  }

  async writeRange(
    spreadsheetId: string,
    range: string,
    values: string[][],
    valueInputOption: "RAW" | "USER_ENTERED" = "USER_ENTERED",
  ) {
    const client = this.getClient();
    const response = await client.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: { values },
    });
    return response.data;
  }

  async resolveSheetId(spreadsheetId: string, sheetName: string): Promise<number> {
    const tabs = await this.listSheets(spreadsheetId);
    const tab = tabs.find((t) => t.title === sheetName);
    if (!tab) {
      throw new Error(
        `Sheet "${sheetName}" not found. Available sheets: ${tabs.map((t) => t.title).join(", ")}`,
      );
    }
    return tab.sheetId;
  }

  async batchUpdate(spreadsheetId: string, requests: sheets_v4.Schema$Request[]) {
    const client = this.getClient();
    const response = await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    return response.data;
  }

  async searchDriveSpreadsheets(query: string) {
    const auth = new google.auth.GoogleAuth({
      keyFile: this.credentialsPath,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.spreadsheet' and name contains '${query.replace(/'/g, "\\'")}'`,
      fields: "files(id,name,webViewLink)",
      pageSize: 20,
    });

    return (response.data.files ?? []).map((f) => ({
      id: f.id!,
      name: f.name!,
      url: f.webViewLink ?? `https://docs.google.com/spreadsheets/d/${f.id}/edit`,
    }));
  }
}
