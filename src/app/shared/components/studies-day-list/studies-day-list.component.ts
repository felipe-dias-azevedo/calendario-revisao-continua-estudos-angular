import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {StudyDayContent} from "./studies-day-list";
import {MatDialog} from "@angular/material/dialog";
import {ModalDetailsSubjectComponent} from "../modal/details-subject/modal-details-subject.component";

@Component({
  selector: '[app-studies-day-list]',
  templateUrl: './studies-day-list.component.html',
  styleUrls: ['./studies-day-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudiesDayListComponent implements OnInit {

  @Input() day!: number;
  @Input() subjectsToday!: StudyDayContent[];
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
}
