import { z } from "zod";

export const CustomReportPlanStepPurposeSchema = z.enum(["source", "transform", "sheet"]);

export type CustomReportPlanStepPurpose = z.infer<typeof CustomReportPlanStepPurposeSchema>;

export const CustomReportPlanStepRepSchema = z.object({
  id: z.string().min(1).describe("stable step identifier, such as step1"),
  title: z.string().describe("short title of the plan (max 5 words)"),
  detailedDescription: z
    .string()
    .describe("long, detailed description of what this step exactly does"),
  signature: z
    .string()
    .describe(
      "Typescript function signature for the code function executing this step. Signatures are purely about data flow. Source steps take no arguments and must return Promise<...>. Later steps receive the awaited output of the previous step as their only argument. Params are never function arguments.",
    ),
  purpose: CustomReportPlanStepPurposeSchema.describe(
    "source for the first step, transform for intermediate steps, sheet for the final step. Source steps fetch data and must return Promise<...>.",
  ),
  dependsOnStepId: z.string().optional().describe("the previous step id for linear v1 pipelines"),
});

export type CustomReportPlanStepRep = z.infer<typeof CustomReportPlanStepRepSchema>;

export const CustomReportPlanRepSchema = z.object({
  params: z
    .string()
    .default("void")
    .describe(
      'Plan-level Typescript type for runtime parameters. E.g. "{ startDate: Date; endDate: Date }" or "void" if no params are needed.',
    ),
  steps: z.array(CustomReportPlanStepRepSchema),
});

export type CustomReportPlanRep = z.infer<typeof CustomReportPlanRepSchema>;
