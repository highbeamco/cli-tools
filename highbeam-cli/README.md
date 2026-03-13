# Highbeam CLI

A command-line interface for managing your Highbeam business finances — accounts, transactions, payments, cards, reports, and more.

## Getting Started

### 1. Install

```bash
cd highbeam-cli
npm install
npm run build
npm i -g .
```

This makes the `highbeam` command available globally.

### 2. Log in

```bash
highbeam login
```

This opens your browser to authenticate with Highbeam via Auth0. Your token is stored locally at `~/.highbeam/auth-token.json`.

Use `--force` to re-authenticate if needed.

### 3. Add a business

```bash
highbeam business add
```

Interactive prompt lets you search and select from businesses on your account. Use `--default` to set it as the default immediately.

### 4. Verify your setup

```bash
highbeam business list --added
```

Confirm your business appears in the local config. You're ready to go.

### 5. Run commands

```bash
highbeam transaction list
highbeam account list
highbeam cash-flow-report get
```

All data commands output JSON to stdout, so you can pipe to `jq` or other tools.

## Commands

```
highbeam
├── login [--force]                          Authenticate with Highbeam
│
├── business                                 Manage businesses
│   ├── get                                  Show business profile
│   ├── add [--default]                      Add a business to local config
│   ├── list [--added]                       List available businesses
│   ├── set-name -n <name>                   Rename a business locally
│   └── set-default --business <name>        Set the default business
│
├── account list                             List bank deposit accounts and balances
│
├── capital-account list                     List lines of credit, term loans, and credit facilities
│
├── card list                                List physical and virtual payment cards
│
├── transaction list [-l <limit>] [-o <offset>]
│                                            List enriched transactions across all accounts
│
├── bill list                                List accounts payable bills
│
├── payee list                               List vendors and payment recipients
│
├── payment list                             List payments and settlement status
│
├── credit-application list                  List credit applications and review status
│
├── cash-flow-report get [-e <date>] [-i <interval>] [-p <periods>]
│                                            Cash flow analysis by period, counterparty, and category
│
└── hybrid-report get [-e <date>] [-i <interval>] [-p <periods>]
                                             Extended cash flow breakdown by payment instrument
```

## Global Flags

| Flag | Description |
|------|-------------|
| `--business <name>` | Override the default business for any data command |
| `-v, --verbose` | Enable verbose logging |
| `--help` | Show help text |
| `--version` | Show version |

## Report Options

Both `cash-flow-report` and `hybrid-report` accept:

| Flag | Default | Description |
|------|---------|-------------|
| `-e, --end <date>` | Today | End date (`YYYY-MM-DD`) |
| `-i, --interval <duration>` | `P7D` | ISO 8601 duration (`P7D`, `P1M`, etc.) |
| `-p, --periods <number>` | `13` | Number of periods to include |

## Configuration

All local state lives in `~/.highbeam/`:

| File | Purpose |
|------|---------|
| `config.json` | Added businesses and default selection |
| `auth-token.json` | OAuth2 access and refresh tokens |
