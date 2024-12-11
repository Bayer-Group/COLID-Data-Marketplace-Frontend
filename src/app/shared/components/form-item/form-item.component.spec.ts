import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormItemComponent } from './form-item.component';
import { MetaDataProperty } from '../../models/metadata/meta-data-property';

// TODO: needs proper mock of input data
xdescribe('FormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  let mockMetaData: MetaDataProperty = {
    key: 'test',
    properties: new Map<string, any>(),
    nestedMetadata: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;

    component.metaData = mockMetaData;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
