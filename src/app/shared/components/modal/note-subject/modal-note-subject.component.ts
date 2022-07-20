import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NoteSubject} from "./note-subject";
import {NotifyService} from "../../../services/notify/notify.service";

@Component({
  selector: 'app-modal-note-subject',
  templateUrl: './modal-note-subject.component.html',
  styleUrls: ['./modal-note-subject.component.css']
})
export class ModalNoteSubjectComponent implements OnInit {

  note?: string;
  newNote?: string;

  constructor(
      private dialogRef: MatDialogRef<ModalNoteSubjectComponent, NoteSubject>,
      @Inject(MAT_DIALOG_DATA) public data: NoteSubject,
      private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    this.note = this.data.note;
    this.newNote = this.note;
  }

  save() {
    if (this.newNote === this.note) {
      this.notifyService.show('Dados não foram alterados');
      return;
    }

    this.dialogRef.close({ note: this.newNote?.trim() });
  }

}
