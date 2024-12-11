import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ResourceRetentionClasses } from 'src/app/shared/models/resourcePolicies/resource-retentionClass';
import { RetentionClassPolicies } from 'src/app/shared/models/resourcePolicies/retentionClass-Policies';
import { ResourcePoliciesState } from 'src/app/states/resource-policies.state';

@Component({
  selector: 'app-resource-policies',
  templateUrl: './resource-policies.component.html',
  styleUrls: ['./resource-policies.component.scss']
})
export class ResourcePoliciesComponent implements OnInit {
  @Select(ResourcePoliciesState.getPolicies) ResourcePolicies$: Observable<
    ResourceRetentionClasses[]
  >;

  pidUri: string;
  retentionClassPolicies: RetentionClassPolicies[] = [];

  constructor(
    public dialogRef: MatDialogRef<ResourcePoliciesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.pidUri = this.data.pidUri;
    this.ResourcePolicies$.subscribe((rp) => {
      this.retentionClassPolicies = rp.find(
        (x) => x.pidUri == this.pidUri
      ).retentionClassPolicies;
    });
  }
}
