export enum CustomReportArtifactNodeCategory {
  DataSource = "data-source",
}

export type CustomReportArtifactNode = {
  id: string;
  title: string;
  description: string;
  source: string;
};

export type CustomReportArtifactEdge = {
  from: string;
  to: string;
};

export type CustomReportArtifactRep = {
  nodes: Record<string, CustomReportArtifactNode>;
  edges: Record<CustomReportArtifactEdge["from"], CustomReportArtifactEdge>;
};
