export class CheckboxHierarchyDTO {
  instantiable: boolean;
  isCategory: boolean;
  hasParent: boolean;
  parentName: string;
  id: string;
  hasChild: boolean;
  name: string;
  description: string;
  children: CheckboxHierarchyDTO[];
  level: number = 0;
}
