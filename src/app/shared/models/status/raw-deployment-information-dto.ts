export interface RawDeploymentInformationDto {
  deployment_created_at: Date;
  services: {
    [key: string]: {
      deployment_type: 'ui' | 'api';
      image_digest: string;
      image_pushed_at_epoch_utc_seconds: number;
      image_repository: string;
      image_tag: string;
      image_tags: string[];
      service_name: string;
    };
  };
  version: string;
}
