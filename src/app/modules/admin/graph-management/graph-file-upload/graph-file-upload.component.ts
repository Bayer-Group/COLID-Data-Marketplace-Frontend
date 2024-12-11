import { Component, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-graph-file-upload',
  templateUrl: './graph-file-upload.component.html',
  styleUrls: ['./graph-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GraphFileUploadComponent,
      multi: true
    }
  ]
})
export class GraphFileUploadComponent implements ControlValueAccessor {
  @ViewChild('fileDropRef', { static: false }) fileDropRef: ElementRef;

  onChange: any = () => {};
  onTouched: any = () => {};

  file: File | null = null;

  writeValue(_value: any) {
    // clear file input after upload
    if (this.fileDropRef != null && this.fileDropRef.nativeElement != null) {
      this.fileDropRef.nativeElement.value = '';
      this.file = null;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    if (files && files[0]) {
      this.file = files[0];
      this.onChange(this.file);
      this.onTouched();
    }
  }
}
