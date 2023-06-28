import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "loadingIndicator",
})
export class LoadingIndicatorPipe implements PipeTransform {
  transform(
    loadingIndicators: { favListId: string; loading: boolean }[],
    favoriteListId: string
  ): boolean {
    var indicatorIndex = loadingIndicators.findIndex(
      (i) => i.favListId == favoriteListId
    );
    return indicatorIndex > -1
      ? loadingIndicators[indicatorIndex].loading
      : false;
  }
}
