import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StatusBuildInformationDto } from 'src/app/shared/models/status/status-build-information-dto';
import { StatusState, FetchBuildInformation } from 'src/app/states/status.state';
import { Observable } from 'rxjs';
import { BUILD } from 'src/assets/build-variables';
import { LogService } from 'src/app/core/logging/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  @Select(StatusState.getBuildInformation) buildInformation$: Observable<StatusBuildInformationDto>;

  frontendBuildInformation = BUILD;
  releaseNotesUrl = environment.releaseNotesUrl;

  constructor(private store: Store, private logger: LogService) {
      this.logger.debug('ResourceHelpComponent constructor');
  }

  ngOnInit() { }
}
