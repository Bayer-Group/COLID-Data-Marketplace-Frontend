export class SimilarityDoc{
    'https://pid.bayer.com/kos/19050/hasLabel': string;
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': string;
    'https://pid.bayer.com/kos/19050/hasResourceDefinition': string
    'score_combined': number;
    'http://pid.bayer.com/kos/19014/hasPID': string;

}

export class SimilarityResult {
    doc_count: number;
    threshold: number;
    next_threshold: number;
    docs: SimilarityDoc[];
}


export class Success {
    success: boolean;
}
