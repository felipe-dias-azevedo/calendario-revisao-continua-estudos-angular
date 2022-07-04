import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRemoveComponent } from './modal-remove.component';

describe('RemoveComponent', () => {
  let component: ModalRemoveComponent;
  let fixture: ComponentFixture<ModalRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRemoveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
