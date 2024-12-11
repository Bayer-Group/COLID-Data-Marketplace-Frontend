import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeywordManagementApiService } from 'src/app/core/http/keyword-management.api.service';
import { GraphKeywordUsage } from 'src/app/shared/models/key-management/graph-keyword-usage-dto';
import { KeywordGraphUpdateDto } from 'src/app/shared/models/key-management/keyword-graph-update-dto';

interface KeywordManagementConfirmationData {
  graphPidUri: string;
  graphType: string[];
  itemsAdded: GraphKeywordUsage[];
  itemsEdited: GraphKeywordUsage[];
  itemsDeleted: GraphKeywordUsage[];
}

@Component({
  selector: 'app-keyword-management-confirmation-dialog',
  templateUrl: './keyword-management-confirmation-dialog.component.html',
  styleUrls: ['./keyword-management-confirmation-dialog.component.scss']
})
export class KeywordManagementConfirmationDialogComponent {
  newGraphFormGroup: FormGroup;
  graphNameFormControl: FormControl<string>;
  graphTypeFormControl: FormControl<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: KeywordManagementConfirmationData,
    public dialogRef: MatDialogRef<KeywordManagementConfirmationDialogComponent>,
    private keywordManagementApi: KeywordManagementApiService,
    private formBuilder: FormBuilder
  ) {
    this.graphNameFormControl = new FormControl(
      `${this.data.graphPidUri}/`,
      Validators.required
    );
    this.graphTypeFormControl = new FormControl(
      this.data.graphType.length > 0 ? this.data.graphType[0] : '',
      Validators.required
    );
    this.newGraphFormGroup = this.formBuilder.group({
      graphNameFormControl: this.graphNameFormControl,
      graphTypeFormControl: this.graphTypeFormControl
    });
  }

  saveNewGraphVersion() {
    const keywordGraphUpdate: KeywordGraphUpdateDto = {
      graph: this.data.graphPidUri,
      saveAsGraph: this.newGraphFormGroup.value.graphNameFormControl,
      saveAsType: this.newGraphFormGroup.value.graphTypeFormControl,
      additions: this.data.itemsAdded.map((i) => ({ label: i.label })),
      deletions: this.data.itemsDeleted.map((i) => ({ keyId: i.keyId })),
      updations: this.data.itemsEdited.map((i) => ({
        keyId: i.keyId,
        label: i.label
      }))
    };
    this.keywordManagementApi
      .modifyKeywordGraph(keywordGraphUpdate)
      .subscribe((res) => {
        this.dialogRef.close({ newlyCreatedGraphUri: res });
      });
  }
}
