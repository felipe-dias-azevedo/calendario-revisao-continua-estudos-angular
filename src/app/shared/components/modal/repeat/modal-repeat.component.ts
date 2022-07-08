import {Component, Inject, OnInit} from '@angular/core';
import {NewSubject, Subject} from "../../../services/subject/subject";
import {SubjectDayRepeat} from "./subject-day-repeat";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {isTilYearEnd} from "../../../validators/numbers.validators";
import {isSubjectDayRepeated} from "../../../validators/subjects.validators";
import {SubjectDayRepeatValue} from "./subject-day-repeat-value";
import {v4 as uuid} from "uuid";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ParentIdentifiableContext} from "../../../services/context-storage/identifiable-context";
import {SubjectService} from "../../../services/subject/subject.service";
import '../../../extensions/date.extensions';

@Component({
  selector: 'app-modal-repeat',
  templateUrl: './modal-repeat.component.html',
  styleUrls: ['./modal-repeat.component.css']
})
export class ModalRepeatComponent implements OnInit {

  private subjects!: Subject[];
  subjectDates!: MatTableDataSource<SubjectDayRepeat>;

  private firstDate!: Date;

  formNewDaysSubject!: FormGroup;

  anyDayAdded!: boolean;

  constructor(
    private dialogRef: MatDialogRef<ModalRepeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ParentIdentifiableContext,
    private subjectService: SubjectService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.anyDayAdded = false;
    this.subjects = this.subjectService.getByParentId(this.data.parentId);
    const actualSubjects = this.subjects.sort((a, b) => b.date.diffInDays(a.date));
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
    console.log(idSubject);
    this.subjectDates.data = this.subjectDates.data.filter(s => s.idSubject !== idSubject);
    this.resetValidators();
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
