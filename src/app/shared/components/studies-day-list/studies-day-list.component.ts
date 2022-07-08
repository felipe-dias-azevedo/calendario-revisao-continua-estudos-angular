import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {StudiesDaysList, StudyDayContent} from "./studies-day-list";
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
  @Output("updateChildren") updateChildren: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  showDetailsModal(id: string): void {
    const detailsDialog = this.dialog.open(ModalDetailsSubjectComponent, {
      data: { id },
      panelClass: 'modal-container'
    });
    detailsDialog.afterClosed().subscribe(() => this.updateChildren.emit());
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
