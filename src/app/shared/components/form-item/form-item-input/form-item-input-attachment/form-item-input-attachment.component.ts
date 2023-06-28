import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormItemInputBaseComponent } from "../form-item-input-base/form-item-input-base.component";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Metadata } from "src/app/shared/models/metadata/meta-data";
import { Entity } from "src/app/shared/models/entities/entity";
import { FormChangedDTO } from "src/app/shared/models/form/form-changed-dto";
import { FormService } from "src/app/shared/services/form.service";
import { Constants } from "src/app/shared/constants";
import { Observable, of } from "rxjs";
import { PidUriTemplateResultDTO } from "src/app/shared/models/pidUriTemplates/pid-uri-template-result-dto";
import { MatDialog } from "@angular/material/dialog";
import { DeleteItemDialogComponent } from "src/app/shared/components/delete-item-dialog/delete-item-dialog.component";
import { MetaDataProperty } from "src/app/shared/models/metadata/meta-data-property";
import { AttachmentApiService } from "src/app/core/http/attachment.api.service";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { AttachmentUploadedDto } from "src/app/shared/models/attachment/attachment-uploaded-dto";
import { FormItemChangedDTO } from "src/app/shared/models/form/form-item-changed-dto";

@Component({
  selector: "app-form-item-input-attachment",
  templateUrl: "./form-item-input-attachment.component.html",
  styleUrls: ["./form-item-input-attachment.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputAttachmentComponent),
      multi: true,
    },
  ],
})
export class FormItemInputAttachmentComponent extends FormItemInputBaseComponent {
  @Input() newAttachmentEntities: string[];
  @Input() errors: any;
  @Input() metaData: Metadata[];
  @Input() label: string;
  @Input() fetched: boolean;
  @Input() presets: Observable<Array<PidUriTemplateResultDTO>>;
  @Input() indexerNested: number;
  @Input() formReadOnly: boolean = false;
  @Output() attachmentUploaded: EventEmitter<AttachmentUploadedDto> =
    new EventEmitter<AttachmentUploadedDto>();

  attachmentFileName: string = "Choose file";
  attachmentFileToUpload: File = null;
  isUploadInProgress: boolean = false;

  constants = Constants;
  @Output() removeFormItem: EventEmitter<any> = new EventEmitter<any>();

  get fetched$() {
    return of(this.fetched);
  }

  get attachmentMetadata() {
    if (this.internalValue != null && this.internalValue.properties != null) {
      const metadata = this.metaData.find(
        (r) => r.key === Constants.Attachment.Type
      );
      return metadata.properties;
    }
    return null;
  }

  constructor(
    private formService: FormService,
    private attachmentApiService: AttachmentApiService,
    public dialog: MatDialog,
    private snackBar: ColidMatSnackBarService
  ) {
    super();
  }

  writeValue(value: Entity): void {
    if (value != null) {
      this.internalValue = value;
      let attachmentFileName =
        this.internalValue.properties[Constants.Metadata.RdfsLabel];
      if (attachmentFileName != null && attachmentFileName.length > 0) {
        this.attachmentFileName = attachmentFileName[0];
      }
    }
  }

  confirmAndRemoveAttachment() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        header: `Deleting ${this.label.toLowerCase()}`,
        body: `Are you sure you want to delete this ${this.label.toLowerCase()}?`,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.isNewEntity) {
          this.removeFormItem.emit();
          return;
        }

        this.attachmentApiService
          .deleteAttachment(this.internalValue.id)
          .subscribe(
            (_) => {
              this.removeFormItem.emit();
              this.snackBar.success(
                this.label,
                `The ${this.label.toLowerCase()} has been deleted completely.`
              );
            },
            (error) => {
              if (error.status == 409) {
                this.removeFormItem.emit();
                this.snackBar.info(
                  this.label,
                  `The ${this.label.toLowerCase()} is already in use by the published or another resource and can therefore not be deleted completely. However, the reference has been removed.`,
                  null,
                  8000
                );
              }
            }
          );
      }
    });
  }

  handleAttachmentFileSelected(files: FileList) {
    if (files.length > 0) {
      this.attachmentFileToUpload = files.item(0);
      this.attachmentFileName = this.attachmentFileToUpload.name;
    }
  }

  handleAttachmentFormChanged(event: FormChangedDTO) {
    this.internalValue.properties = event.formValue;

    const entity = this.createEntity(
      event.formValue,
      this.internalValue.id,
      this.attachmentMetadata
    );
    const formItemChangedDTO = new FormItemChangedDTO(event.id, entity);
    this.handleInputChange(formItemChangedDTO);
  }

  createEntity(formValues, id, metaData: MetaDataProperty[]) {
    const formProperties = Object.entries(formValues);
    const entity = this.formService.createEntity(formProperties, metaData);
    entity.id = id;
    return entity;
  }

  handleInputChange(event: FormItemChangedDTO) {
    this.onChange(event.value);
    this.onTouched();

    this.internalValue.properties = event.value.properties;
    this.valueChanged.emit(event);
  }

  uploadAttachment() {
    const comment = this.internalValue.properties[Constants.Attachment.Comment];

    if (this.attachmentFileToUpload == null || comment == null) {
      this.snackBar.error(
        this.label,
        `Please select a file and add a comment before uploading the ${this.label.toLowerCase()}.`
      );
    } else {
      this.isUploadInProgress = true;
      this.attachmentApiService
        .uploadAttachment(this.attachmentFileToUpload, comment)
        .subscribe(
          (result) => {
            this.isUploadInProgress = false;
            const oldTemporaryId = this.internalValue.id;

            this.internalValue.id = result.id;
            this.internalValue.properties[Constants.Metadata.EntityType] = [
              Constants.Attachment.Type,
            ];
            this.internalValue.properties[Constants.Metadata.RdfsLabel] = [
              result.s3File.fileName,
            ];
            this.internalValue.properties[Constants.Attachment.FileSize] = [
              result.s3File.fileSize,
            ];
            this.internalValue.properties[Constants.Attachment.FileType] = [
              result.s3File.fileType,
            ];

            const entity = this.createEntity(
              this.internalValue.properties,
              this.internalValue.id,
              this.attachmentMetadata
            );
            const formItemChangedDTO = new FormItemChangedDTO(
              Constants.Metadata.RdfsLabel + this.indexerNested,
              entity
            );
            this.handleInputChange(formItemChangedDTO);

            this.snackBar.success(
              this.label,
              `The ${this.label.toLowerCase()} was uploaded successfully.`
            );
            this.attachmentUploaded.emit(
              new AttachmentUploadedDto(oldTemporaryId, result.id)
            );
          },
          (_) => {
            this.isUploadInProgress = false;
            this.snackBar.error(
              this.label,
              `The ${this.label.toLowerCase()} could not be uploaded.`
            );
          }
        );
    }
  }

  get isUploadable(): boolean {
    if (!this.isNewEntity) {
      return false;
    }

    if (this.internalValue == null || this.internalValue.properties == null) {
      return false;
    }

    const comment = this.internalValue.properties[Constants.Attachment.Comment];
    if (
      this.attachmentFileToUpload == null ||
      comment == null ||
      comment.length == 0 ||
      comment[0].trim() == ""
    ) {
      return false;
    }

    if (this.isFileUploaded) {
      return false;
    }

    return true;
  }

  get isFileUploaded(): boolean {
    return this.internalValue == null
      ? false
      : !this.internalValue.id.startsWith(Constants.Resource.Prefix);
  }

  get isNewEntity(): boolean {
    return this.internalValue == null
      ? false
      : this.newAttachmentEntities.includes(this.internalValue.id);
  }
}
