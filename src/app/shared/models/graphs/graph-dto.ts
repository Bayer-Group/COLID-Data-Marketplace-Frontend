import { GraphStatus } from "./graph-status";

export class GraphDto {
  // Uri of the named graph
  name: string;

  // Describes the status of the named graph in the database
  graphStatus: GraphStatus;

  // Specifies the start time since the graph is used by the system,
  // if a metadata graph configuration is referenced.
  startTime: string;
}
