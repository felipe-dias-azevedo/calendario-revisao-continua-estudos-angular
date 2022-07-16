import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImportTableComponent } from './modal-import-table.component';

describe('ModalImportTableComponent', () => {
  let component: ModalImportTableComponent;
  let fixture: ComponentFixture<ModalImportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalImportTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalImportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
