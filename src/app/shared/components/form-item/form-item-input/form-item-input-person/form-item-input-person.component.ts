import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormItemInputBaseComponent } from '../form-item-input-base/form-item-input-base.component';
import { MultiselectSettings } from 'src/app/shared/models/form/multi-select-settings';
import { AdObject } from 'src/app/shared/models/activeDirectory/ad-object';
import { PersonApiService } from 'src/app/core/http/person.api.service';
import { MetaDataProperty } from 'src/app/shared/models/metadata/meta-data-property';
import { AdSearchResult } from 'src/app/shared/models/activeDirectory/ad-search-result';
import { Subject, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
  map,
  debounceTime
} from 'rxjs/operators';

// TODO: Unify - duplicate code with colid-ui-editor-frontend

@Component({
  selector: 'app-form-item-input-person',
  templateUrl: './form-item-input-person.component.html',
  styleUrls: ['./form-item-input-person.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormItemInputPersonComponent),
      multi: true
    }
  ]
})
export class FormItemInputPersonComponent extends FormItemInputBaseComponent {
  @Input() maxCount: number;
  @Input() multiselectSettings: MultiselectSettings;
  @Input() metadata: MetaDataProperty;

  persons$: Observable<any>;

  groupByFn = (item) => item.type;

  personLoading = false;
  personInput$ = new Subject<string>();

  constructor(private personApiService: PersonApiService) {
    super();
    this.loadPersons();
  }

  private loadPersons() {
    this.persons$ = this.personInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.personLoading = true)),
      switchMap((term) =>
        this.personApiService.searchPerson(term).pipe(
          catchError(() => of(new AdSearchResult())), // empty list on error
          map((res) => {
            this.personLoading = false;
            return this.buildPersonList(res);
          })
        )
      )
    );
  }

  writeValue(value: any): void {
    if (value != null) {
      this.internalValue = value;
    }
  }

  trackByFn(item: AdObject) {
    return item.id;
  }

  buildPersonList(res: AdSearchResult): any[] {
    const users = res.users.map((user) => {
      return {
        type: 'Users',
        ...(<AdObject>user)
      };
    });

    const groups = res.groups.map((group) => {
      return {
        type: 'Groups',
        ...(<AdObject>group)
      };
    });

    return users.concat(groups);
  }
}
