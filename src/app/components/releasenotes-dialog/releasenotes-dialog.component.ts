import { Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { MarkdownService } from "ngx-markdown";
import { Observable } from "rxjs";
import { FetchReleaseNotes, StatusState } from "src/app/states/status.state";

@Component({
  selector: "app-releasenotes-dialog",
  templateUrl: "./releasenotes-dialog.component.html",
  styleUrls: ["./releasenotes-dialog.component.scss"],
})
export class ReleasenotesDialogComponent {
  @Select(StatusState.getReleaseNotes) releaseNotes$: Observable<string>;

  constructor(private markdownService: MarkdownService, private store: Store) {
    this.store.dispatch(new FetchReleaseNotes());
    this.markdownService.renderer.heading = (text: string, level: number) => {
      return `<h${level + 2}><b>${text}</b></h${level + 2}>`;
    };
  }

  onLoad($event) {
    console.log("Loaded successfully", $event);
  }

  onError($event) {
    console.error("Load failed", $event);
  }
}
