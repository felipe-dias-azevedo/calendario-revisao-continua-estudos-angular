import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FileDataFormated} from "../../../models/file-data";
import {MatTableDataSource} from "@angular/material/table";
import {Subject} from "../../../services/subject/subject";
import {Materia} from "../../../services/materia/materia";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {getTextColorFrom} from '../../../constants/colors';

@Component({
  selector: 'app-modal-import-table',
  templateUrl: './modal-import-table.component.html',
  styleUrls: ['./modal-import-table.component.css']
})
export class ModalImportTableComponent implements OnInit {

  subjects!: MatTableDataSource<Subject>;
  materias!: MatTableDataSource<Materia>;
  subtopics!: MatTableDataSource<Subtopic>;

  constructor(
      private dialogRef: MatDialogRef<ModalImportTableComponent, FileDataFormated>,
      @Inject(MAT_DIALOG_DATA) public data: FileDataFormated
  ) { }

  ngOnInit(): void {
    this.subjects = new MatTableDataSource<Subject>(this.data.subjects);
    this.materias = new MatTableDataSource<Materia>(this.data.materias);
    this.subtopics = new MatTableDataSource<Subtopic>(this.data.subtopics);
  }

  save() {
    const data: FileDataFormated = {
      subjects: this.subjects.data,
      materias: this.materias.data,
      subtopics: this.subtopics.data
    }
    this.dialogRef.close(data);
  }

  getTextColorFrom(color: string) {
    return getTextColorFrom(color);
  }
}
