import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { StatusBuildInformationDto } from 'src/app/shared/models/status/status-build-information-dto';
import { StatusState } from 'src/app/states/status.state';
import { Observable } from 'rxjs';
import { LogService } from 'src/app/core/logging/log.service';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  @Select(StatusState.getBuildInformation)
  buildInformation$: Observable<StatusBuildInformationDto>;

  releaseNotesUrl = environment.releaseNotesUrl;
  logo = Constants.Assets.Logo;

  constructor(
    private store: Store,
    private logger: LogService,
    private dialog: MatDialog
  ) {
    this.logger.debug('ResourceHelpComponent constructor');
  }
}
