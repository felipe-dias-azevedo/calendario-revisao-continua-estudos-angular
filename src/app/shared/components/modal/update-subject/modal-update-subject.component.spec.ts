import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateSubjectComponent } from './modal-update-subject.component';

describe('UpdateSubjectComponent', () => {
  let component: ModalUpdateSubjectComponent;
  let fixture: ComponentFixture<ModalUpdateSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpdateSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpdateSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
