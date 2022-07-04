import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesDayListComponent } from './studies-day-list.component';

describe('StudiesDayListComponent', () => {
  let component: StudiesDayListComponent;
  let fixture: ComponentFixture<StudiesDayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudiesDayListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudiesDayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
