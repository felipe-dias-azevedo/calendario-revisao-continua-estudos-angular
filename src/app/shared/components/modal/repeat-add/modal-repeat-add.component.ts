import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectDayRepeat } from '../../../models/subject-day-repeat';
import { AddSubjectDayRepeat } from './add-subject-day-repeat';
import { isTilYearEnd } from '../../../validators/numbers.validators';
import { isSubjectDayRepeated } from '../../../validators/subjects.validators';
import { SubjectDayRepeatValue } from '../../../models/subject-day-repeat-value';
import { ModalRepeatAddModel } from './modal-repeat-add-model';

@Component({
  selector: 'app-modal-repeat-add',
  templateUrl: './modal-repeat-add.component.html',
  styleUrls: ['./modal-repeat-add.component.css']
})
export class ModalRepeatAddComponent implements OnInit {

  subjectDates!: MatTableDataSource<AddSubjectDayRepeat>;

  firstDate!: Date;

  formNewDaysSubject!: FormGroup;

  anyDayAdded!: boolean;

  constructor(
    private dialogRef: MatDialogRef<ModalRepeatAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalRepeatAddModel,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.anyDayAdded = false;

    this.firstDate = this.data.firstDate;
    const daysAmmounts = this.data.ammounts.sort((a, b) => +a - +b);

    const actualSubjectsDays: AddSubjectDayRepeat[] = daysAmmounts.map(s => {
      return {
        ammount: s,
        date: this.firstDate.clone().addDays(s)
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

    const newSubject: AddSubjectDayRepeat = {
      date: this.firstDate.clone().addDays(newDayValue),
      ammount: newDayValue
    };
    this.subjectDates.data = [...this.subjectDates.data, newSubject]
        .sort((a, b) => b.date.diffInDays(a.date));

    formSubjectElement.resetForm();
    this.resetData();
    this.anyDayAdded = true;
  }

  removeDay(day: number) {
    this.subjectDates.data = this.subjectDates.data.filter(s => s.ammount !== day);
    this.resetValidators();
    this.anyDayAdded = true;
  }

  saveDays() {
    const newSubjects = this.subjectDates.data;
    const days = newSubjects.map(s => s.ammount);
    
    this.dialogRef.close({ confirm: true, days });
  }
}
