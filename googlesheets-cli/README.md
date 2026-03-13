# Google Sheets CLI

A command-line interface for reading, writing, and managing Google Sheets — including sheet operations, cell formatting, sorting, and Drive search.

## Getting Started

### 1. Set up credentials

This CLI uses a Google service account for authentication.

1. Create a Google Cloud project (or use an existing one)
2. Enable the **Google Sheets API** and **Google Drive API**
3. Create a service account and download the JSON key file
4. Place the key file at the project root as `credentials.json`, or set `GOOGLE_CREDENTIALS_PATH` to a custom path
5. Share any spreadsheets you want to access with the service account's email address

### 2. Install

```bash
cd googlesheets-cli
npm install
npm run build
npm i -g .
```

This makes the `gsheets` command available globally.

### 3. Run commands

```bash
gsheets open <spreadsheet>
gsheets read <spreadsheet> "'Sheet1'!A1:D10"
gsheets search "Q1 Sales"
```

All commands accept a spreadsheet URL or raw spreadsheet ID. Output is JSON.

## Commands

```
gsheets
│
├── Spreadsheets
│   ├── open <spreadsheet>                   Show spreadsheet metadata
│   └── search <query>                       Search Google Drive for spreadsheets by name
│
├── Sheets / Tabs
│   ├── list <spreadsheet>                   List all sheets in a spreadsheet
│   ├── add-sheet <spreadsheet> <name>       Add a new sheet
│   │     [--rows <n>] [--cols <n>]
│   ├── delete-sheet <spreadsheet> <name>    Delete a sheet (requires --force)
│   │     [--force]
│   ├── rename-sheet <spreadsheet>           Rename a sheet
│   │     --from <name> --to <name>
│   └── duplicate-sheet <spreadsheet>        Duplicate a sheet with data and formatting
│         --source <name> --name <name>
│
├── Data
│   ├── read <spreadsheet> <range>           Read cell values from a range
│   ├── write <spreadsheet> <range>          Write values to a range
│   │     -d <json> [--raw]
│   └── search-cells <spreadsheet> <query>   Search for cells containing text
│         [--sheet <name>]
│
├── Rows
│   ├── insert-rows <spreadsheet>            Insert blank rows at a position
│   │     --sheet <name> --row <n> --count <n>
│   └── delete-rows <spreadsheet>            Delete rows (requires --force)
│         --sheet <name> --row <n> --count <n> [--force]
│
└── Formatting
    ├── sort <spreadsheet> <range>           Sort a range by column(s)
    │     --by <col...> [--desc]
    ├── bgcolor <spreadsheet> <range> <hex>  Set background color
    ├── merge <spreadsheet> <range>          Merge cells
    │     [--type MERGE_ALL|MERGE_COLUMNS|MERGE_ROWS]
    ├── borders <spreadsheet> <range>        Set cell borders
    │     [--style <style>] [--color <hex>] [--sides <sides>]
    └── auto-resize <spreadsheet>            Auto-resize columns to fit content
          --sheet <name> [--start <col>] [--end <col>]
```

## Global Flags

| Flag | Description |
|------|-------------|
| `-v, --verbose` | Enable verbose logging |
| `--help` | Show help text |
| `--version` | Show version |

## Code Organization

```
googlesheets-cli/
├── bin/
│   └── gsheets                          Executable entry point
├── src/
│   ├── index.ts                         CLI setup — registers all commands with Commander.js
│   ├── commands/                         One file per command
│   │   ├── shared.ts                    Auth setup shared across all commands
│   │   ├── open.ts                      Spreadsheet metadata
│   │   ├── search.ts                    Drive search
│   │   ├── list-sheets.ts              List sheets/tabs
│   │   ├── read.ts                      Read cell data
│   │   ├── write.ts                     Write cell data
│   │   ├── search-cells.ts             Find cells by text
│   │   ├── add-sheet.ts                Add sheet
│   │   ├── delete-sheet.ts             Delete sheet
│   │   ├── rename-sheet.ts             Rename sheet
│   │   ├── duplicate-sheet.ts          Duplicate sheet
│   │   ├── insert-rows.ts             Insert rows
│   │   ├── delete-rows.ts             Delete rows
│   │   ├── sort-range.ts              Sort range
│   │   ├── set-background-color.ts    Set background color
│   │   ├── merge-cells.ts            Merge cells
│   │   ├── update-borders.ts          Set borders
│   │   └── auto-resize-columns.ts     Auto-resize columns
│   └── services/
│       ├── sheets-client.ts             Google Sheets API wrapper (read, write, batch update, Drive search)
│       ├── url-parser.ts                Parses spreadsheet URLs and raw IDs
│       ├── a1-parser.ts                 A1 notation utilities (column letters, range parsing, hex-to-RGB)
│       └── logger/
│           ├── Logger.ts                Logger interface
│           ├── ConsoleLogger.ts         Colored console logger with timestamps
│           └── index.ts                 Exports
├── dist/                                Compiled JavaScript output
├── credentials.json                     Google service account key (not committed)
├── package.json
└── tsconfig.json
```

**How it fits together:** `bin/gsheets` loads `src/index.ts`, which registers every command from `src/commands/` with Commander.js. Each command file uses `shared.ts` to authenticate, then calls methods on `SheetsClient` from `src/services/sheets-client.ts` to interact with the Google Sheets and Drive APIs. Utility services handle URL parsing, A1 notation, and logging.
