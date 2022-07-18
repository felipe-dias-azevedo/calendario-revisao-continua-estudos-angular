import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImportExportComponent } from './modal-import-export.component';

describe('ModalImportExportComponent', () => {
  let component: ModalImportExportComponent;
  let fixture: ComponentFixture<ModalImportExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImportExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
