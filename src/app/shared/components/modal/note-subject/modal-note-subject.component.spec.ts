import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteSubjectComponent } from './modal-note-subject.component';

describe('ModalNoteSubjectComponent', () => {
  let component: ModalNoteSubjectComponent;
  let fixture: ComponentFixture<ModalNoteSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNoteSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNoteSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
