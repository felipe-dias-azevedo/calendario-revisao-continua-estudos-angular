import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ModalAlertTypeContent} from "./modal-alert-type-content";
import {ModalAlertResponse} from "./modal-alert-response";

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.css']
})
export class ModalAlertComponent implements OnInit {

  alertTypeContent!: ModalAlertTypeContent;

  constructor(
    private dialogRef: MatDialogRef<ModalAlertComponent, ModalAlertResponse>,
    @Inject(MAT_DIALOG_DATA) public data: ModalAlertTypeContent
  ) { }

  ngOnInit(): void {
    this.alertTypeContent = this.data;
  }

  confirmAction(confirm: boolean) {
    this.dialogRef.close({ confirm });
  }
}
