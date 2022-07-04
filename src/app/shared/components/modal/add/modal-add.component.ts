import {Component, OnInit} from '@angular/core';
import {SubjectService} from "../../../services/subject/subject.service";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {NewSubtopic, Subtopic} from "../../../services/subtopic/subtopic";
import {Materia, NewMateria} from "../../../services/materia/materia";
import {ModalAddTabType} from "./modal-add-tab-type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NewSubject, Subject} from "../../../services/subject/subject";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {NotifyService} from "../../../services/notify/notify.service";

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.css']
})
export class ModalAddComponent implements OnInit {

  subtopics!: Subtopic[];
  materias!: Materia[];

  tabType!: ModalAddTabType;

  // TODO: Use angular forms for validation
  // TODO: Detect if isMobile to touchUI on Datepicker (better accessibility)

  subjectName!: string;
  subtopicName!: string;
  materiaName!: string;
  subtopicId!: string;
  materiaId!: string;
  dataInicio!: Date;
  materiaColor!: string;

  private mensagemErro = 'Algum campo informado não foi preenchido';
  private mensagemFechar = 'Fechar';


  constructor(
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    this.resetValues();

    this.tabType = ModalAddTabType.Subject;
    this.updateData();
  }

  private resetValues() {
    this.subjectName = '';
    this.subtopicName = '';
    this.materiaName = '';
    this.subtopicId = '';
    this.materiaId = '';
    this.dataInicio = new Date();
    this.materiaColor = '#000000';
  }

  private updateData() {
    this.subtopics = this.subtopicService.get();
    this.materias = this.materiaService.get();
  }

  changeTabType(event: MatTabChangeEvent) {
    this.tabType = event.index;
    this.updateData();
  }

  saveMateria() {
    if (this.materiaName === undefined || this.materiaName.trim() === '') {
      this.notifyError();
      return;
    }

    this.materiaService.add({
      name: this.materiaName,
      color: this.materiaColor
    });

    this.notify('Matéria salva com sucesso!');

    this.resetValues();
  }

  saveSubject() {
    if (
      this.subjectName === undefined ||
      this.subjectName.trim() === '' ||
      this.subtopicId === undefined ||
      this.subtopicId.trim() === '' ||
      this.materiaId === undefined ||
      this.materiaId.trim() === ''
    ) {
      this.notifyError();
      return;
    }

    const subject: NewSubject = {
      name: this.subjectName,
      materiaId: this.materiaId,
      subtopicId: this.subtopicId,
      date: this.dataInicio
    };

    const daysToAdd = [0,7,15,30];

    this.subjectService.addInDays(subject, daysToAdd);

    this.notify('Disciplina salva com sucesso!');

    this.resetValues();
  }

  saveSubtopic() {
    if (this.subtopicName === undefined || this.subtopicName.trim() === '') {
      this.notifyError();
      return;
    }

    this.subtopicService.add({
      name: this.subtopicName,
    });

    this.notify('Frente salva com sucesso!');

    this.resetValues();
  }

  private notify(message: string) {
    this.notifyService.show(message);
  }

  private notifyError() {
    this.notify(this.mensagemErro);
  }
}
