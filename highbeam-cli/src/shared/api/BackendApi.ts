import { KyInstance } from "ky";

export type BackendApi = BackendApiV1 | BackendApiV2 | BackendApiAi;

export type BackendApiV1 = { type: "v1"; ky: KyInstance };
export type BackendApiV2 = { type: "v2"; ky: KyInstance };
export type BackendApiAi = { type: "ai"; ky: KyInstance };
