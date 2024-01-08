export interface HierarchicalData {
  nodes: Node[];
  links: Link[];
}

interface Node {
  name: string;
  id: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  percentage: number;
}
