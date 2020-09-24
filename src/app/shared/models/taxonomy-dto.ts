export class TaxonomyDTO {
    id: string;
    hasParent: boolean;
    hasChild: boolean;
    name:string;
    children: TaxonomyDTO[];
    level: number = 0;
}