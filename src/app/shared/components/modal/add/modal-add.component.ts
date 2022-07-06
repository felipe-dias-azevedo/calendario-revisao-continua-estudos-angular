import {Component, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from "../../../services/subject/subject.service";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {Materia} from "../../../services/materia/materia";
import {ModalAddTabType} from "./modal-add-tab-type";
import {NewSubject, Subject} from "../../../services/subject/subject";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {NotifyService} from "../../../services/notify/notify.service";
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {FormMateriaModel} from "./form-materia-model";
import {FormSubjectModel} from "./form-subject-model";
import {FormSubtopicModel} from "./form-subtopic-model";

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.css']
})
export class ModalAddComponent implements OnInit {

  subtopics!: Subtopic[];
  materias!: Materia[];

  formSubject!: FormGroup;
  formSubtopic!: FormGroup;
  formMateria!: FormGroup;

  tabType!: ModalAddTabType;

  constructor(
    private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService
  ) { }


  ngOnInit(): void {
    this.updateData();

    this.tabType = ModalAddTabType.Subject;

    this.formSubject = this.formBuilder.group({
      subjectName: ['', [Validators.required, Validators.minLength(2)]],
      subtopicId: [null, [Validators.required, Validators.minLength(2)]],
      materiaId: [null, [Validators.required, Validators.minLength(2)]],
      dataInicio: [new Date(), Validators.required]
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
      dataInicio: new Date()
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
    const { subjectName, materiaId, subtopicId, dataInicio } = this.formSubject.getRawValue() as FormSubjectModel;

    const subject: NewSubject = {
      name: subjectName,
      materiaId: materiaId,
      subtopicId: subtopicId,
      date: dataInicio
    };

    const daysToAdd = [0,7,15,30];

    this.subjectService.addInDays(subject, daysToAdd);

    this.notify('Disciplina salva com sucesso!');

    formSubjectElement.resetForm();
    this.resetValues();
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
