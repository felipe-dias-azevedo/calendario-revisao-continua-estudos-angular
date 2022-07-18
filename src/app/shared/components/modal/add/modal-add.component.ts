import {Component, OnInit} from '@angular/core';
import {SubjectService} from "../../../services/subject/subject.service";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {Materia} from "../../../services/materia/materia";
import {ModalAddTabType} from "./modal-add-tab-type";
import {NewSubject} from "../../../services/subject/subject";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {NotifyService} from "../../../services/notify/notify.service";
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {FormMateriaModel} from "./form-materia-model";
import {FormSubjectModel} from "./form-subject-model";
import {FormSubtopicModel} from "./form-subtopic-model";
import '../../../extensions/number.extensions';
import { MatDialog } from '@angular/material/dialog';
import { ModalRepeatAddComponent } from '../repeat-add/modal-repeat-add.component';
import { ModalRepeatAddResponse } from '../repeat-add/modal-repeat-add-response';
import { ModalRepeatAddModel } from '../repeat-add/modal-repeat-add-model';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.css']
})
export class ModalAddComponent implements OnInit {

  subtopics!: Subtopic[];
  materias!: Materia[];

  formSubject!: FormGroup;
  subjectDays!: number[];

  formSubtopic!: FormGroup;
  formMateria!: FormGroup;

  tabType!: ModalAddTabType;

  constructor(
    private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.updateData();

    this.subjectDays = [0, 7, 15, 30];
    this.tabType = ModalAddTabType.Subject;

    this.formSubject = this.formBuilder.group({
      subjectName: ['', [Validators.required, Validators.minLength(2)]],
      subtopicId: [null, [Validators.required, Validators.minLength(2)]],
      materiaId: [null, [Validators.required, Validators.minLength(2)]],
      dataInicio: [new Date(), Validators.required],
      comments: null
    });
    this.formSubtopic = this.formBuilder.group({
      subtopicName: ['', Validators.required]
    });
    this.formMateria = this.formBuilder.group({
      materiaName: ['', [Validators.required, Validators.minLength(2)]],
      materiaColor: ['#000000', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]]
    });
  }

  private resetValues() {
    this.formSubject.reset({
      subjectName: '',
      subtopicId: null,
      materiaId: null,
      dataInicio: new Date(),
      comments: null
    });
    this.formSubtopic.reset({
      subtopicName: ''
    });
    this.formMateria.reset({
      materiaName: '',
      materiaColor: '#000000'
    });
  }

  private updateData() {
    this.subtopics = this.subtopicService.get();
    this.materias = this.materiaService.get();
  }

  changeTabType(event: MatTabChangeEvent) {
    this.tabType = event.index;
    this.updateData();
  }

  getDateAddedDay(day: number): Date {
    const value = this.formSubject.get('dataInicio')?.value as Date;

    if (value === undefined || value === null) {
      this.notify("Erro ao obter Data Início da Disciplina");
      return new Date().addDays(day);
    }

    return value.clone().addDays(day);
  }

  saveMateria(formMateriaElement: FormGroupDirective) {
    const { materiaName, materiaColor } = this.formMateria.getRawValue() as FormMateriaModel;

    this.materiaService.add({
      name: materiaName,
      color: materiaColor
    });

    this.notify('Matéria salva com sucesso!');

    formMateriaElement.resetForm();
    this.resetValues();
  }

  saveSubject(formSubjectElement: FormGroupDirective) {
    const { subjectName, materiaId, subtopicId, dataInicio, comments } = this.formSubject.getRawValue() as FormSubjectModel;

    const subject: NewSubject = {
      name: subjectName,
      materiaId: materiaId,
      subtopicId: subtopicId,
      date: dataInicio,
      comments: comments ?? undefined
    };

    const daysToAdd = this.subjectDays;

    this.subjectService.addInDays(subject, daysToAdd);

    this.notify('Disciplina salva com sucesso!');

    formSubjectElement.resetForm();
    this.resetValues();
  }

  updateSubjectRepeats() {
    const daysToAdd: ModalRepeatAddModel = {
      ammounts: this.subjectDays,
      firstDate: this.getDateAddedDay(0),
    };
    const repeatDialog = this.dialog.open<ModalRepeatAddComponent, ModalRepeatAddModel, ModalRepeatAddResponse>(ModalRepeatAddComponent, {
      panelClass: 'modal-container',
      data: daysToAdd
    });
    repeatDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm || result.days === undefined || result.days.length === 0) {
        return;
      }

      this.subjectDays = result.days;
    });
  }

  saveSubtopic(formSubtopicElement: FormGroupDirective) {
    const { subtopicName } = this.formSubtopic.getRawValue() as FormSubtopicModel;

    this.subtopicService.add({
      name: subtopicName,
    });

    this.notify('Frente salva com sucesso!');

    formSubtopicElement.resetForm();
    this.resetValues();
  }

  private notify(message: string) {
    this.notifyService.show(message);
  }
}
