import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { environment } from 'src/environments/environment';
import { Store, Select} from '@ngxs/store';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { WelcomeMessageState } from 'src/app/states/welcome-message.state';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';

@Component({
  selector: 'app-welcome-content',
  templateUrl: './welcome-content.component.html',
  styleUrls: ['./welcome-content.component.scss']
})
export class WelcomeContentComponent implements OnInit {
  @Output() searchChange = new EventEmitter();
  @Select(WelcomeMessageState.getWelcomeMessage) welcomeMessage$: Observable<WelcomeMessage>;

  searchText: string = '*';
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  handleSearchChange(searchText: string) {
    this.searchChange.emit(searchText);
  }

  handleInputChange(searchText: string) {
    this.searchText = searchText;
    console.log("app-welcome-content handleInputChange");
  }

  search() {
    this.searchChange.emit(this.searchText);
  }

  goToEditor() {
    const url = environment.pidUrl;
    window.open(url, '_blank');
  }

  transformYourHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
}
