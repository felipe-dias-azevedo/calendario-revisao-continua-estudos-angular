import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRepeatAddComponent } from './modal-repeat-add.component';

describe('ModalRepeatAddComponent', () => {
  let component: ModalRepeatAddComponent;
  let fixture: ComponentFixture<ModalRepeatAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRepeatAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRepeatAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
