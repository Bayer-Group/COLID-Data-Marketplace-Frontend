import { Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { FormItemInputBaseComponent } from "../form-item-input-base/form-item-input-base.component";
import { Guid } from "guid-typescript";

@Component({
  selector: "app-form-item-input-checkbox",
  templateUrl: "./form-item-input-checkbox.component.html",
  styleUrls: ["./form-item-input-checkbox.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputCheckboxComponent),
      multi: true,
    },
  ],
})
export class FormItemInputCheckboxComponent extends FormItemInputBaseComponent {
  id: any;

  constructor() {
    super();
    this.id = Guid.create();
  }

  writeValue(value: any): void {
    if (value != null && value !== "") {
      this.internalValue = JSON.parse(value);
    }
  }
}
