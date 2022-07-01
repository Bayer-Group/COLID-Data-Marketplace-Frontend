export class SchemeUiResult {
    columns:any[]
    tables:any[]
}

export class Filed{
    resourceId:string;
    pidURI:string;
    
}

export class TableFiled extends Filed{
    linkedTableFiled:Filed[]
}

export class SchemeUi{
    columns:Filed[]
    tables:TableFiled[]
}

export class SchemaUIResult{
    columns:any[]
    tables:any[]
}

export enum Schema_Support {
    Dataset='https://pid.bayer.com/kos/19050/NonRDFDataset',
    Table = 'https://pid.bayer.com/kos/19050/444586',
    Column= 'https://pid.bayer.com/kos/19050/444582',
    Subset= 'http://www.w3.org/2000/01/rdf-schema#subClassOf'
  }