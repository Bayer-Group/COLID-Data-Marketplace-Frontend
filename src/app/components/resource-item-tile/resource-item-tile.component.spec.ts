import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceItemTileComponent } from './resource-item-tile.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Constants } from 'src/app/shared/constants';
import {
  MockResourceStatusIndicatorsComponent,
  MockColidIconsComponent,
  MockMatDialogRef
} from 'src/app/shared/mocks/unit-test-mocks';

describe('ResourceItemTileComponent', () => {
  let component: ResourceItemTileComponent;
  let fixture: ComponentFixture<ResourceItemTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResourceItemTileComponent,
        MockResourceStatusIndicatorsComponent,
        MockColidIconsComponent
      ],
      imports: [MatListModule, MatDividerModule],
      providers: [{ provide: MatDialog, useClass: MockMatDialogRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceItemTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open resource details dialog on tile click', () => {
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open'
    ).and.callThrough();

    component.pidUri = 'test-uri';
    component.lifeCycleStatus = Constants.Resource.LifeCycleStatus.Draft;

    component.openResourceDetailsDialog();

    expect(dialogSpy).toHaveBeenCalled();
  });
});
