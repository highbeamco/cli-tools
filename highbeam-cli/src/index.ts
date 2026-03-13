#!/usr/bin/env node

import { resolve } from "node:path";
import { config } from "dotenv";

// Load .env files from the CLI package root
const root = resolve(__dirname, "..");
config({ path: resolve(root, ".env"), quiet: true });
config({ path: resolve(root, ".env.local"), override: true, quiet: true });

import { program } from "commander";
import { enableVerboseLogging } from "services/logger";
import { loginAction } from "./commands/login";
import {
  businessAddAction,
  businessListAction,
  businessSetNameAction,
  businessSetDefaultAction,
} from "./commands/configure";
import { transactionsAction } from "./commands/transactions";
import { billsAction } from "./commands/bills";
import { businessAction } from "./commands/business";
import { accountsAction } from "./commands/accounts";
import { capitalAccountsAction } from "./commands/capital-accounts";
import { cardsAction } from "./commands/cards";
import { creditApplicationsAction } from "./commands/credit-applications";
import { payeesAction } from "./commands/payees";
import { paymentsAction } from "./commands/payments";
import { cashFlowReportAction } from "./commands/cash-flow-report";
import { hybridReportAction } from "./commands/hybrid-report";

program
  .name("highbeam")
  .description("Highbeam CLI")
  .version("0.1.0")
  .option("-v, --verbose", "enable verbose logging")
  .hook("preAction", () => {
    if (program.opts().verbose) {
      enableVerboseLogging();
    }
  });

// --- Auth ---

program
  .command("login")
  .description("Authenticate with Highbeam")
  .option("-f, --force", "force re-authentication even if already logged in")
  .action(loginAction);

// --- Business Management ---

const business = program
  .command("business")
  .description("Manage businesses on Highbeam. Run a subcommand for more details.");

business
  .command("get")
  .description("Show business profile details for the configured business")
  .option("--business <business>", "use a specific business instead of default")
  .action(businessAction);

business
  .command("add")
  .description("Add a business to the CLI configuration")
  .option("--default", "set as the default business")
  .action(businessAddAction);

business
  .command("list")
  .description("List all businesses")
  .option("--added", "list only businesses added to the CLI configuration")
  .action(businessListAction);

business
  .command("set-name")
  .description("Rename a business in the configuration")
  .requiredOption("-n, --name <name>", "new business name")
  .option("--business <business>", "business to rename (defaults to default business)")
  .action(businessSetNameAction);

business
  .command("set-default")
  .description("Set the default business")
  .requiredOption("--business <business>", "business to set as default")
  .action(businessSetDefaultAction);

// --- Data Commands ---

const transaction = program
  .command("transaction")
  .description("Money movements across connected financial accounts, enriched with categorization and counterparty info. Run a subcommand for more details.");

transaction
  .command("list")
  .description("List enriched transactions across all connected accounts (bank, cards, Plaid)")
  .option("-l, --limit <number>", "max number of transactions to return", "20")
  .option("-o, --offset <number>", "offset for pagination", "0")
  .option("--business <business>", "use a specific business instead of default")
  .action(transactionsAction);

const bill = program
  .command("bill")
  .description("Incoming invoices from vendors that the business needs to pay. Run a subcommand for more details.");

bill
  .command("list")
  .description("List accounts payable bills and their payment status")
  .option("--business <business>", "use a specific business instead of default")
  .action(billsAction);

const account = program
  .command("account")
  .description("FDIC-insured bank deposit accounts held at partner banks. Run a subcommand for more details.");

account
  .command("list")
  .description("List bank deposit accounts with balances and account details")
  .option("--business <business>", "use a specific business instead of default")
  .action(accountsAction);

const capitalAccount = program
  .command("capital-account")
  .description("Lines of credit, term loans, and charge card credit facilities. Run a subcommand for more details.");

capitalAccount
  .command("list")
  .description("List capital accounts (lines of credit, term loans, charge cards)")
  .option("--business <business>", "use a specific business instead of default")
  .action(capitalAccountsAction);

const card = program
  .command("card")
  .description("Physical and virtual payment cards issued against bank or capital accounts. Run a subcommand for more details.");

card
  .command("list")
  .description("List charge cards with spend limits and cardholder info")
  .option("--business <business>", "use a specific business instead of default")
  .action(cardsAction);

const creditApplication = program
  .command("credit-application")
  .description("Applications for capital credit, tracking progression from submission through approval. Run a subcommand for more details.");

creditApplication
  .command("list")
  .description("List credit/capital applications and their review status")
  .option("--business <business>", "use a specific business instead of default")
  .action(creditApplicationsAction);

const payee = program
  .command("payee")
  .description("Vendors and recipients the business sends payments to. Run a subcommand for more details.");

payee
  .command("list")
  .description("List payees (vendors/recipients) and their payment methods")
  .option("--business <business>", "use a specific business instead of default")
  .action(payeesAction);

const payment = program
  .command("payment")
  .description("Money transfers from bank or capital accounts to payees. Run a subcommand for more details.");

payment
  .command("list")
  .description("List payments and their settlement status")
  .option("--business <business>", "use a specific business instead of default")
  .action(paymentsAction);

const cashFlowReport = program
  .command("cash-flow-report")
  .description("Cash flow analysis showing inflows and outflows by period, counterparty, and category. Run a subcommand for more details.");

cashFlowReport
  .command("get")
  .description("Cash flow forecast broken down by counterparty and category")
  .option("-e, --end <date>", "end date in YYYY-MM-DD (defaults to today)")
  .option("-i, --interval <interval>", "ISO duration interval (e.g. P7D, P1M)", "P7D")
  .option("-p, --periods <number>", "number of periods", "13")
  .option("--business <business>", "use a specific business instead of default")
  .action(cashFlowReportAction);

const hybridReport = program
  .command("hybrid-report")
  .description("Extended cash flow analysis broken down by payment instrument source. Run a subcommand for more details.");

hybridReport
  .command("get")
  .description("Combined cash flow and accrual report by counterparty, category, and source")
  .option("-e, --end <date>", "end date in YYYY-MM-DD (defaults to today)")
  .option("-i, --interval <interval>", "ISO duration interval (e.g. P7D, P1M)", "P7D")
  .option("-p, --periods <number>", "number of periods", "13")
  .option("--business <business>", "use a specific business instead of default")
  .action(hybridReportAction);

program.parse();
