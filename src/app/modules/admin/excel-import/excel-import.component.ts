import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import * as _ from "lodash-es";
//mport * as XLSX from 'xlsx';
import { environment } from "src/environments/environment";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";

@Component({
  selector: "app-excel-import",
  templateUrl: "./excel-import.component.html",
  styleUrls: ["./excel-import.component.css"],
})
export class ExcelImportComponent implements OnInit {
  @ViewChild("UploadFileInput", { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: UntypedFormGroup = null;
  fileInputLabel: string;
  selectedFile: File = null;
  constructor(
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private snackBar: ColidMatSnackBarService
  ) {}

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      myfile: [""],
    });
  }

  onFileSelect(event) {
    let af = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!_.includes(af, file.type)) {
        this.snackBar.error("Select File", "Only Excel files Allowed!");
      } else {
        this.fileInputLabel = file.name;
        this.selectedFile = file;
        this.fileUploadForm.get("myfile").setValue(file);
      }
    }
  }

  onFormSubmit() {
    if (!this.fileUploadForm.get("myfile").value) {
      this.snackBar.error(
        "Select File",
        "Please choose your Excel template file."
      );
      return false;
    }
    const url = `${environment.colidApiUrl}/importExcel`;

    const formData = new FormData();
    formData.append("file", this.selectedFile, this.selectedFile.name);

    let httpHeaders = new HttpHeaders().set("x-skip-content-type", "");

    const httpOptions = {
      headers: httpHeaders,
    };

    this.http.post<any>(url, formData, httpOptions).subscribe(
      (_) => {
        this.snackBar.success(
          "Import Status",
          "Your Import has been started. It could take some minutes, until the status appears in your notifications.",
          null,
          4000
        );
        // Reset the file input
        this.uploadFileInput.nativeElement.value = "";
        this.fileInputLabel = undefined;
        this.fileUploadForm.get("myfile").setValue(null);
      },
      (_) => {
        this.snackBar.error("Upload Error", "Unable to upload file.");
      }
    );
  }
}

// public uploadExcel() {}
