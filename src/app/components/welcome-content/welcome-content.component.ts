import { Component, EventEmitter, Output } from "@angular/core";
import { environment } from "src/environments/environment";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { WelcomeMessageState } from "src/app/states/welcome-message.state";
import { WelcomeMessage } from "src/app/shared/models/welcome-message";

@Component({
  selector: "app-welcome-content",
  templateUrl: "./welcome-content.component.html",
  styleUrls: ["./welcome-content.component.scss"],
})
export class WelcomeContentComponent {
  @Output() searchChange = new EventEmitter();
  @Select(WelcomeMessageState.getWelcomeMessageDataMarketplace)
  welcomeMessage$: Observable<WelcomeMessage>;

  searchText: string = "*";
  constructor(private sanitizer: DomSanitizer) {}

  handleSearchChange(searchText: string) {
    this.searchChange.emit(searchText);
  }

  handleInputChange(searchText: string) {
    this.searchText = searchText;
  }

  search() {
    this.searchChange.emit(this.searchText);
  }

  goToEditor() {
    const url = environment.pidUrl;
    window.open(url, "_blank");
  }

  transformYourHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
}
