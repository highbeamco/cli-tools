#!/usr/bin/env node

import { program } from "commander";
import { enableVerboseLogging } from "services/logger";
import { openAction } from "./commands/open";
import { searchAction } from "./commands/search";
import { listSheetsAction } from "./commands/list-sheets";
import { readAction } from "./commands/read";
import { writeAction } from "./commands/write";
import { searchCellsAction } from "./commands/search-cells";
import { addSheetAction } from "./commands/add-sheet";
import { deleteSheetAction } from "./commands/delete-sheet";
import { renameSheetAction } from "./commands/rename-sheet";
import { duplicateSheetAction } from "./commands/duplicate-sheet";
import { insertRowsAction } from "./commands/insert-rows";
import { deleteRowsAction } from "./commands/delete-rows";
import { sortRangeAction } from "./commands/sort-range";
import { setBackgroundColorAction } from "./commands/set-background-color";
import { mergeCellsAction } from "./commands/merge-cells";
import { updateBordersAction } from "./commands/update-borders";
import { autoResizeColumnsAction } from "./commands/auto-resize-columns";

program
  .name("gsheets")
  .description("Google Sheets CLI")
  .version("0.1.0")
  .option("-v, --verbose", "enable verbose logging")
  .hook("preAction", () => {
    if (program.opts().verbose) {
      enableVerboseLogging();
    }
  });

// --- Spreadsheet Commands ---

program
  .command("open")
  .description("Open a spreadsheet by URL or ID and show its metadata")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .action(openAction);

program
  .command("search")
  .description("Search for spreadsheets by name in Google Drive")
  .argument("<query>", "search term to match against spreadsheet names")
  .action(searchAction);

// --- Sheet/Tab Commands ---

program
  .command("list")
  .description("List all sheets/tabs in a spreadsheet")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .action(listSheetsAction);

program
  .command("add-sheet")
  .description("Add a new sheet/tab to a spreadsheet")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<name>", "name for the new sheet")
  .option("--rows <number>", "number of rows (default 1000)")
  .option("--cols <number>", "number of columns (default 26)")
  .action(addSheetAction);

program
  .command("delete-sheet")
  .description("Delete a sheet/tab (destructive)")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<sheet-name>", "name of the sheet to delete")
  .option("--force", "confirm deletion")
  .action(deleteSheetAction);

program
  .command("rename-sheet")
  .description("Rename an existing sheet/tab")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .requiredOption("--from <name>", "current sheet name")
  .requiredOption("--to <name>", "new sheet name")
  .action(renameSheetAction);

program
  .command("duplicate-sheet")
  .description("Duplicate an existing sheet/tab with all data and formatting")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .requiredOption("--source <name>", "name of the sheet to duplicate")
  .requiredOption("--name <name>", "name for the copy")
  .action(duplicateSheetAction);

// --- Data Commands ---

program
  .command("read")
  .description("Read data from a range (A1 notation)")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range, e.g. \"'Sheet1'!A1:D10\"")
  .action(readAction);

program
  .command("write")
  .description("Write data to a range")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range, e.g. \"'Sheet1'!A1:D10\"")
  .requiredOption("-d, --data <json>", "JSON 2D array of values, e.g. '[[\"a\",\"b\"],[\"c\",\"d\"]]'")
  .option("--raw", "write exact strings (skip number/date parsing)")
  .action(writeAction);

program
  .command("search-cells")
  .description("Search for cells containing text across sheets")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<query>", "text to search for (case-insensitive)")
  .option("--sheet <name>", "limit search to a specific sheet")
  .action(searchCellsAction);

// --- Row Operations ---

program
  .command("insert-rows")
  .description("Insert blank rows at a given position")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .requiredOption("--sheet <name>", "sheet name")
  .requiredOption("--row <number>", "1-indexed row number to insert before")
  .requiredOption("--count <number>", "number of blank rows to insert")
  .action(insertRowsAction);

program
  .command("delete-rows")
  .description("Delete rows starting at a position")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .requiredOption("--sheet <name>", "sheet name")
  .requiredOption("--row <number>", "1-indexed starting row number")
  .requiredOption("--count <number>", "number of rows to delete")
  .option("--force", "confirm deletion")
  .action(deleteRowsAction);

// --- Formatting Commands ---

program
  .command("sort")
  .description("Sort a range by one or more columns")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range (exclude header row)")
  .requiredOption("--by <columns...>", "column letter(s) to sort by, e.g. A B")
  .option("--desc", "sort descending (default ascending)")
  .action(sortRangeAction);

program
  .command("bgcolor")
  .description("Set background color of a cell range")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range")
  .argument("<color>", "hex color code, e.g. #FF0000")
  .action(setBackgroundColorAction);

program
  .command("merge")
  .description("Merge a range of cells")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range")
  .option("--type <type>", "MERGE_ALL, MERGE_COLUMNS, or MERGE_ROWS", "MERGE_ALL")
  .action(mergeCellsAction);

program
  .command("borders")
  .description("Set borders on a cell range")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .argument("<range>", "A1 notation range")
  .option("--style <style>", "DOTTED, DASHED, SOLID, SOLID_MEDIUM, SOLID_THICK, DOUBLE, NONE", "SOLID")
  .option("--color <hex>", "border color in #RRGGBB", "#000000")
  .option("--sides <sides>", "all, outer, inner, top, bottom, left, right", "all")
  .action(updateBordersAction);

program
  .command("auto-resize")
  .description("Auto-resize columns to fit content")
  .argument("<spreadsheet>", "spreadsheet URL or ID")
  .requiredOption("--sheet <name>", "sheet name")
  .option("--start <column>", "first column letter (default A)", "A")
  .option("--end <column>", "last column letter (default Z)", "Z")
  .action(autoResizeColumnsAction);

program.parse();
