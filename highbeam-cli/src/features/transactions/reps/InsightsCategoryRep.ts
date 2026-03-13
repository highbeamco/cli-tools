import { z } from "zod/v4";

export const richInsightsCategories = [
  {
    name: "SalesRetail",
    label: "Sales - Retail",
    description: "Revenue from in-store retail sales",
  },
  {
    name: "SalesWebsite",
    label: "Sales - Website",
    description: "Revenue from online website sales",
  },
  {
    name: "SalesWholesale",
    label: "Sales - Wholesale",
    description: "Revenue from wholesale transactions",
  },
  {
    name: "SalesReturns",
    label: "Sales - Returns",
    description: "Refunds and returned product credits",
  },
  {
    name: "CashManagementBankInterest",
    label: "Cash Management - Bank Interest",
    description: "Interest earned on bank deposits",
  },
  {
    name: "CashManagementRewards",
    label: "Cash Management - Rewards",
    description: "Cashback and rewards program income",
  },
  {
    name: "MarketingAgencyFee",
    label: "Marketing - Agency Fee",
    description: "Payments to marketing agencies",
  },
  {
    name: "MarketingPaidMedia",
    label: "Marketing - Paid Media",
    description: "Paid advertising and media spend",
  },
  {
    name: "MarketingPhotographyAndAssets",
    label: "Marketing - Photography & Assets",
    description: "Creative asset and photography costs",
  },
  {
    name: "MarketingPromotions",
    label: "Marketing - Promotions",
    description: "Promotional campaigns and discount costs",
  },
  {
    name: "FinanceFeesBankFees",
    label: "Finance Fees - Bank Fees",
    description: "Bank service and account fees",
  },
  {
    name: "FinanceFeesMerchantFees",
    label: "Finance Fees - Merchant Fees",
    description: "Payment processing and merchant fees",
  },
  {
    name: "ProductionAndDevelopmentProductSuppliers",
    label: "Production & Development - Product Suppliers",
    description: "Payments to product suppliers",
  },
  {
    name: "ProductionAndDevelopmentOther",
    label: "Production & Development - Other",
    description: "Other production and development costs",
  },
  {
    name: "ProductionAndDevelopmentThirdPartyInventory",
    label: "Production & Development - Third Party Inventory",
    description: "Third-party inventory purchases",
  },
  {
    name: "FulfillmentShipping",
    label: "Fulfillment - Shipping",
    description: "Shipping and delivery costs",
  },
  {
    name: "FulfillmentOther",
    label: "Fulfillment - Other",
    description: "Other fulfillment and logistics costs",
  },
  {
    name: "PeopleBenefits",
    label: "People - Benefits",
    description: "Employee benefits and health insurance",
  },
  {
    name: "PeopleContractors",
    label: "People - Contractors",
    description: "Payments to independent contractors",
  },
  {
    name: "PeoplePayroll",
    label: "People - Payroll",
    description: "Employee salary and wage payments",
  },
  {
    name: "PeoplePayrollTaxes",
    label: "People - Payroll Taxes",
    description: "Employer payroll tax obligations",
  },
  {
    name: "RentAndUtilitiesRent",
    label: "Rent & Utilities - Rent",
    description: "Office and facility rent payments",
  },
  {
    name: "RentAndUtilitiesOther",
    label: "Rent & Utilities - Other",
    description: "Other rent and utility expenses",
  },
  {
    name: "RentAndUtilitiesUtilities",
    label: "Rent & Utilities - Utilities",
    description: "Electricity, water, and utility bills",
  },
  {
    name: "RetailStorefrontExpenses",
    label: "Retail Storefront Expenses",
    description: "In-store retail operating expenses",
  },
  {
    name: "ProfessionalServicesAccountingAndFinance",
    label: "Professional Services - Accounting & Finance",
    description: "Accounting and financial service fees",
  },
  {
    name: "ProfessionalServicesConsultants",
    label: "Professional Services - Consultants",
    description: "Consulting and advisory service fees",
  },
  {
    name: "ProfessionalServicesRepairsAndMaintenance",
    label: "Professional Services - Repairs & Maintenance",
    description: "Repair and maintenance service costs",
  },
  {
    name: "ProfessionalServicesLegal",
    label: "Professional Services - Legal",
    description: "Legal counsel and service fees",
  },
  {
    name: "OtherConsignmentPayouts",
    label: "Other - Consignment Payouts",
    description: "Payouts from consignment arrangements",
  },
  {
    name: "OtherEquipmentAndSupplies",
    label: "Other - Equipment & Supplies",
    description: "Equipment and supply purchases",
  },
  {
    name: "OtherInsurance",
    label: "Other - Insurance",
    description: "Business insurance premium payments",
  },
  {
    name: "OtherSoftwareAndWebHosting",
    label: "Other - Software & Web Hosting",
    description: "Software subscriptions and hosting costs",
  },
  {
    name: "OtherTeamExpenses",
    label: "Other - Team Expenses",
    description: "Team meals, events, and expenses",
  },
  {
    name: "OtherTravel",
    label: "Other - Travel",
    description: "Business travel and transportation costs",
  },
  {
    name: "OtherOther",
    label: "Other - Other",
    description: "Miscellaneous uncategorized expenses",
  },
  { name: "TaxesCustoms", label: "Taxes - Customs", description: "Import duties and customs fees" },
  {
    name: "TaxesIncomeTax",
    label: "Taxes - Income Tax",
    description: "Federal and state income taxes",
  },
  {
    name: "TaxesSalesTax",
    label: "Taxes - Sales Tax",
    description: "Collected and remitted sales taxes",
  },
  {
    name: "FinancingCreditCards",
    label: "Financing - Credit Cards",
    description: "Credit card payments and balances",
  },
  {
    name: "FinancingCreditCardInterest",
    label: "Financing - Credit Card Interest",
    description: "Interest charges on credit cards",
  },
  {
    name: "FinancingLoan",
    label: "Financing - Loan",
    description: "Loan payments and disbursements",
  },
  {
    name: "FinancingEquityInvestment",
    label: "Financing - Equity Investment",
    description: "Equity investments and capital contributions",
  },
  {
    name: "TransfersInternalTransfer",
    label: "Transfers - Internal Transfer",
    description: "Transfers between owned accounts",
  },
  {
    name: "UncategorizedApPlatform",
    label: "Uncategorized - AP Platform",
    description: "Accounts payable platform transactions",
  },
  {
    name: "Uncategorized",
    label: "Uncategorized",
    description: "Transactions not yet categorized",
  },
] as const;

export type InsightsCategory = (typeof richInsightsCategories)[number]["name"];
export const insightsCategories = richInsightsCategories.map((c) => c.name) as InsightsCategory[];
export const InsightsCategorySchema = z.enum(
  richInsightsCategories.map((c) => c.name) as [InsightsCategory, ...InsightsCategory[]],
);

export type InsightsCategoryGroupType = "Operating" | "NonOperating";

export type InsightsCategoryGroupDirection = "In" | "Out" | "Bidirectional" | "Uncategorized";

export interface InsightsCategoryComplete {
  readonly categoryDisplayName: string;
  readonly subcategoryDisplayName: string;
  readonly groupTypeValue: InsightsCategoryGroupType;
  readonly groupTypeDisplayName: string;
  readonly groupDirectionValue: InsightsCategoryGroupDirection;
  readonly groupDirectionDisplayName: string | null;
  readonly groupDisplayName: string;
  readonly value: InsightsCategory;
}

export const InsightsCategoryCompleteSchema = z.object({
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupTypeValue: z.enum(["Operating", "NonOperating"]),
  groupTypeDisplayName: z.string(),
  groupDirectionValue: z.enum(["In", "Out", "Bidirectional", "Uncategorized"]),
  groupDirectionDisplayName: z.string().nullable(),
  groupDisplayName: z.string(),
  value: InsightsCategorySchema,
});
