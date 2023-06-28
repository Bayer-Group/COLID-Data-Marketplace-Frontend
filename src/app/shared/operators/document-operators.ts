import { DetailsViewModel } from "../../components/search-result/search-result.component";
import { Constants } from "src/app/shared/constants";

export function getValueForKey(details: DetailsViewModel[], key: string) {
  const foundValue: DetailsViewModel = details.find((d) => d.key === key);
  if (foundValue === undefined) {
    return [];
  }
  return foundValue.value;
}

export function getUriForKey(details: DetailsViewModel[], key: string) {
  const foundValue: DetailsViewModel = details.find((d) => d.key === key);
  if (foundValue === undefined) {
    return [];
  }
  return foundValue.valueEdge;
}

// Returns PID Uri without highlighting for linking purposes
export function getPidUriForHref(details: DetailsViewModel[]) {
  const foundValue: DetailsViewModel = details.find(
    (d) => d.key === Constants.Metadata.HasPidUri
  );
  if (foundValue === undefined) {
    return [];
  }
  return foundValue.valueForHref;
}
