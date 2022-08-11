import {Component, Inject, OnInit} from '@angular/core';
import {NewSubject, Subject} from "../../../services/subject/subject";
import {SubjectDayRepeat} from "../../../models/subject-day-repeat";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {isTilYearEnd} from "../../../validators/numbers.validators";
import {isSubjectDayRepeated} from "../../../validators/subjects.validators";
import {SubjectDayRepeatValue} from "../../../models/subject-day-repeat-value";
import {v4 as uuid} from "uuid";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ParentIdentifiableContext} from "../../../services/context-storage/identifiable-context";
import {SubjectService} from "../../../services/subject/subject.service";
import '../../../extensions/date.extensions';
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {SubjectNullableData} from "../../../models/subject-nullable-data";
import {ModalRepeatResponse} from "./modal-repeat-response";

@Component({
  selector: 'app-modal-repeat',
  templateUrl: './modal-repeat.component.html',
  styleUrls: ['./modal-repeat.component.css']
})
export class ModalRepeatComponent implements OnInit {

  subjectData!: SubjectNullableData;

  private subjects!: Subject[];
  subjectDates!: MatTableDataSource<SubjectDayRepeat>;

  private firstDate!: Date;

  formNewDaysSubject!: FormGroup;

  anyDayAdded!: boolean;

  constructor(
    private dialogRef: MatDialogRef<ModalRepeatComponent, ModalRepeatResponse>,
    @Inject(MAT_DIALOG_DATA) public data: ParentIdentifiableContext,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.anyDayAdded = false;

    this.subjectService.getByParentId(this.data.parentId).subscribe(s => {
      this.subjects = s;
      const actualSubjects = this.subjects.sort((a, b) => b.date.diffInDays(a.date));

      this.subjectData = {
        subject: actualSubjects[0],
        materia: null,
        subtopic: null
      }
      this.materiaService.getById(actualSubjects[0].materiaId).subscribe(m => this.subjectData.materia = m);
      this.subtopicService.getById(actualSubjects[0].subtopicId).subscribe(s => this.subjectData.subtopic = s);

      this.firstDate = actualSubjects[0].date;

      const actualSubjectsDays: SubjectDayRepeat[] = actualSubjects.map(s => {
        return {
          idSubject: s.id,
          ammount: this.firstDate.diffInDays(s.date),
          date: s.date
        }
      });
      this.subjectDates = new MatTableDataSource([...actualSubjectsDays]);

      const days = this.subjectDates.data.map(s => s.ammount);

      this.formNewDaysSubject = this.formBuilder.group({
        newDayValue: [0, [Validators.required, Validators.min(0), isTilYearEnd, isSubjectDayRepeated(days)]]
      });
    });
  }

  private resetData() {
    this.formNewDaysSubject.reset({
      newDayValue: 0
    });
    this.resetValidators();
  }

  private resetValidators() {
    const days = this.subjectDates.data.map(s => s.ammount);

    const newDayValue = this.formNewDaysSubject.get('newDayValue');
    newDayValue?.setValidators([
      Validators.required, Validators.min(0), isTilYearEnd, isSubjectDayRepeated(days)
    ]);
  }

  addDay(formSubjectElement: FormGroupDirective) {
    const { newDayValue } = this.formNewDaysSubject.getRawValue() as SubjectDayRepeatValue;

    const newSubject = {
      date: this.firstDate.clone().addDays(newDayValue),
      ammount: newDayValue,
      idSubject: uuid()
    };
    this.subjectDates.data = [...this.subjectDates.data, newSubject]
        .sort((a, b) => b.date.diffInDays(a.date));

    formSubjectElement.resetForm();
    this.resetData();
    this.anyDayAdded = true;
  }

  removeDay(idSubject: string) {
    this.subjectDates.data = this.subjectDates.data.filter(s => s.idSubject !== idSubject);
    this.resetValidators();
    this.anyDayAdded = true;
  }

  saveDays() {
    const newSubjects = this.subjectDates.data;
    const oldSubjects: Subject[] = this.subjects.sort((a, b) => b.date.diffInDays(a.date));
    const oldSubject = oldSubjects[0];

    const subject: NewSubject = {
      ...oldSubject,
      date: this.firstDate.clone()
    }

    const days = newSubjects.map(s => s.ammount);

    const parentId = this.subjectService.repeat(subject, oldSubjects, days, this.data.parentId);

    this.dialogRef.close({ parentId });
  }
}
