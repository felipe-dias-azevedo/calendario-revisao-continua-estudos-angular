import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {StudiesDaysList} from "./studies-day-list";
import {MatDialog} from "@angular/material/dialog";
import {ModalDetailsSubjectComponent} from "../modal/details-subject/modal-details-subject.component";
import {weekdays} from "../../constants/weekdays";

@Component({
  selector: 'app-studies-day-list',
  templateUrl: './studies-day-list.component.html',
  styleUrls: ['./studies-day-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudiesDayListComponent implements OnInit {

  @Input() actualDay!: number;
  @Input() monthsForward!: number;
  @Input() subjectPerDayList!: StudiesDaysList;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  showDetailsModal(id: string): void {
    this.dialog.open(ModalDetailsSubjectComponent, {
      data: { id },
      panelClass: 'modal-container'
    });
  }

  getWeekday(day: number) {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() + this.monthsForward, day);
    const weekday = weekdays[date.getDay()];
    return weekday.toUpperCase().substring(0,3);
  }

  isTodayStudyDay(day: number): boolean {
    return this.monthsForward === 0 && this.actualDay == day;
  }
}
