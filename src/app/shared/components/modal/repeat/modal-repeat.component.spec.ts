import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRepeatComponent } from './modal-repeat.component';

describe('ModalRepeatComponent', () => {
  let component: ModalRepeatComponent;
  let fixture: ComponentFixture<ModalRepeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRepeatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRepeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
