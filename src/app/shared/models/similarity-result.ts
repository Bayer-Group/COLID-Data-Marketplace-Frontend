import { Constants } from 'src/app/shared/constants';

export const HasLabel: string = Constants.Metadata.HasLabel;
export const EntityType: string = Constants.Metadata.EntityType;
export const HasResourceDefinition: string =
  Constants.Metadata.HasResourceDefinition;
export const HasPidUri: string = Constants.Metadata.HasPidUri;

export interface SimilarityDoc {
  HasLabel: string;
  EntityType: string;
  HasResourceDefinition: string;
  score_combined: number;
  HasPidUri: string;
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
