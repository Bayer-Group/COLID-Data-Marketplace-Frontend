import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusteringWrapperComponent } from './clustering-wrapper.component';
import { NgxsModule } from '@ngxs/store';
import {
  MockColidSpinnerComponent,
  MockDocumentService
} from 'src/app/shared/mocks/unit-test-mocks';
import { DocumentService } from 'src/app/core/http/document.service';

describe('ClusteringWrapperComponent', () => {
  let component: ClusteringWrapperComponent;
  let fixture: ComponentFixture<ClusteringWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClusteringWrapperComponent, MockColidSpinnerComponent],
      imports: [NgxsModule.forRoot()],
      providers: [{ provide: DocumentService, useClass: MockDocumentService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ClusteringWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
