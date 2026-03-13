import type { BackendApiAi, BackendApiV1, BackendApiV2 } from "../api/BackendApi.js";

export type AgenticBackendApis = {
  v1: BackendApiV1;
  v2: BackendApiV2;
  ai: BackendApiAi;
};
