export type TypescriptDeclarationCode = string; // contents of a .d.ts file

export type TypescriptSourceCode = string;

export type TypescriptDiagnostic = {
  readonly category: "error" | "warning" | "message" | "suggestion";
  readonly code: number;
  readonly message: string;
  readonly filePath?: string;
  readonly line?: number;
  readonly column?: number;
};

export type TypeCheckResult =
  | { type: "Success" }
  | { type: "Failure"; diagnostics: TypescriptDiagnostic[] };
