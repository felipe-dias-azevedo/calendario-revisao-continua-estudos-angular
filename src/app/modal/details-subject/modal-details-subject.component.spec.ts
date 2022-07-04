import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsSubjectComponent } from './modal-details-subject.component';

describe('DetailsSubjectComponent', () => {
  let component: ModalDetailsSubjectComponent;
  let fixture: ComponentFixture<ModalDetailsSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailsSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetailsSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
