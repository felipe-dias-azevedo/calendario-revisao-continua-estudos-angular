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
    private dialogRef: MatDialogRef<ModalRepeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ParentIdentifiableContext,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.anyDayAdded = false;

    this.subjects = this.subjectService.getByParentId(this.data.parentId);
    const actualSubjects = this.subjects.sort((a, b) => b.date.diffInDays(a.date));

    this.subjectData = {
      subject: actualSubjects[0],
      materia: this.materiaService.getById(actualSubjects[0].materiaId),
      subtopic: this.subtopicService.getById(actualSubjects[0].subtopicId)
    }
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

    const subject: NewSubject = {
      date: this.firstDate.clone(),
      name: this.subjects[0].name,
      materiaId: this.subjects[0].materiaId,
      subtopicId: this.subjects[0].subtopicId
    }

    this.subjectService.deleteByParentId(this.data.parentId);

    const days = newSubjects.map(s => s.ammount);
    this.subjectService.addInDays(subject, days);

    this.dialogRef.close({ confirm });
  }
}
