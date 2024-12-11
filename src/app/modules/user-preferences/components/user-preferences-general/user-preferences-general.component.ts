import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import {
  UserInfoState,
  SetMessageConfig
} from 'src/app/states/user-info.state';
import { MessageConfigDto } from 'src/app/shared/models/user/message-config-dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';

@Component({
  selector: 'app-user-preferences-general',
  templateUrl: './user-preferences-general.component.html',
  styleUrls: ['./user-preferences-general.component.scss']
})
export class UserPreferencesGeneralComponent implements OnInit, OnDestroy {
  @Input() set defaultSettings(value: MessageConfigDto) {
    this.savedSettings = value;
    this.fillFormControl();
  }

  @Select(UserInfoState.getMessageConfig)
  messageConfig$: Observable<MessageConfigDto>;
  messageConfigSubscription: Subscription;

  settingsForm: FormGroup;
  savedSettings: MessageConfigDto;

  selectedSendIntervalValue: string;
  selectedDeleteIntervalValue: string;

  sendIntervals: string[] = [
    'Immediately',
    'Daily',
    'Weekly',
    'Monthly',
    'Never'
  ];
  deleteIntervals: string[] = ['Weekly', 'Monthly', 'Quarterly'];

  constructor(
    private store: Store,
    private snackbar: ColidMatSnackBarService
  ) {}

  ngOnInit() {
    this.settingsForm = new FormGroup({
      sendInterval: new FormControl('', Validators.required),
      deleteInterval: new FormControl('', Validators.required)
    });

    this.messageConfigSubscription = this.messageConfig$.subscribe((cfg) => {
      if (cfg != null) {
        this.selectedSendIntervalValue = cfg.sendInterval;
        this.selectedDeleteIntervalValue = cfg.deleteInterval;
        this.savedSettings = new MessageConfigDto(
          this.selectedSendIntervalValue,
          this.selectedDeleteIntervalValue
        );
        this.fillFormControl();
      }
    });
  }

  ngOnDestroy() {
    this.messageConfigSubscription.unsubscribe();
  }

  fillFormControl() {
    if (this.settingsForm == null) {
      return;
    }

    this.fillFormControlByName('sendInterval');
    this.fillFormControlByName('deleteInterval');
  }

  fillFormControlByName(controlName: string) {
    if (this.savedSettings == null) {
      return;
    }

    const control = this.settingsForm.controls[controlName];
    if (control != null) {
      control.setValue(this.savedSettings[controlName]);
    }
  }

  onReset() {
    if (this.valuesChanged) {
      this.fillFormControl();
      this.snackbar.info(
        'Settings restored',
        'The initial setting has been restored.'
      );
    }
  }

  get valuesChanged() {
    return (
      this.settingsForm.controls['sendInterval'].value !==
        this.savedSettings.sendInterval ||
      this.settingsForm.controls['deleteInterval'].value !==
        this.savedSettings.deleteInterval
    );
  }

  get valuesInvalid() {
    const send = this.settingsForm.controls['sendInterval'].value;
    const del = this.settingsForm.controls['deleteInterval'].value;
    // Values are invalid, when the delete interval is less or equal than sendinterval
    // Idea for improvement: use enum with values and int to use > comparison
    return (
      (del === 'Weekly' && (send === 'Weekly' || send === 'Monthly')) ||
      (del === 'Monthly' && send === 'Monthly')
    );
  }

  onSubmit() {
    if (!this.valuesChanged) {
      this.snackbar.warning(
        'Settings unchanged',
        "The settings hasn't been changed."
      );
    } else {
      if (this.valuesInvalid) {
        this.snackbar.warning(
          'Settings invalid',
          'Delete interval has to be later than send interval.'
        );
        return;
      }

      this.savedSettings.sendInterval =
        this.settingsForm.controls['sendInterval'].value;
      this.savedSettings.deleteInterval =
        this.settingsForm.controls['deleteInterval'].value;

      this.store
        .dispatch(new SetMessageConfig(this.savedSettings))
        .subscribe((_) =>
          this.snackbar.success('Settings saved', 'The changes has been saved.')
        );
    }
  }
}
