import { Component, OnInit } from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {SubtopicService} from "../../subtopic/subtopic.service";
import {MateriaService} from "../../materia/materia.service";
import {NotifyService} from "../../shared/notify/notify.service";
import {Subtopic} from "../../subtopic/subtopic";
import {Materia} from "../../materia/materia";
import {ModalRemoveTabType} from "./modal-remove-tab-type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalAlertComponent} from "../../shared/components/modal-alert/modal-alert.component";
import {ModalAlertResponse} from "../../shared/components/modal-alert/modal-alert-response";

@Component({
  selector: 'app-modal-remove',
  templateUrl: './modal-remove.component.html',
  styleUrls: ['./modal-remove.component.css']
})
export class ModalRemoveComponent implements OnInit {

  tabType!: ModalRemoveTabType;

  materias!: Materia[];
  materiaId!: string;

  subtopics!: Subtopic[];
  subtopicId!: string;

  private mensagemErro = 'Não foi selecionado nenhum campo para remoção';

  constructor(
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.resetValues();

    this.tabType = ModalRemoveTabType.Subtopic;
    this.updateData();
  }

  private resetValues() {
    this.subtopicId = '';
    this.materiaId = '';
  }

  private updateData() {
    this.subtopics = this.subtopicService.get();
    this.materias = this.materiaService.get();
  }

  changeTabType(event: MatTabChangeEvent) {
    this.tabType = event.index;
    this.updateData();
  }

  deleteSubtopic() {
    if (this.subtopicId === undefined || this.subtopicId.trim() === '') {
      this.notifyError();
      return;
    }

    const subtopic = this.subtopicService.getById(this.subtopicId)!;

    const confirmationDialog = this.dialog.open<ModalAlertComponent, any, ModalAlertResponse>(ModalAlertComponent, {
      data: {
        typeContent: 'esta Frente',
        nameContent: subtopic.name
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm) {
        return;
      }

      this.subtopicService.deleteById(subtopic.id);

      this.notifyService.show('Frente deletada com sucesso!');

      this.resetValues();
    });
  }

  deleteMateria() {
    if (this.materiaId === undefined || this.materiaId.trim() === '') {
      this.notifyError();
      return;
    }

    const materia = this.materiaService.getById(this.materiaId)!;

    const confirmationDialog = this.dialog.open<ModalAlertComponent, any, ModalAlertResponse>(ModalAlertComponent, {
      data: {
        typeContent: 'esta Matéria',
        nameContent: materia.name
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm) {
        return;
      }

      this.materiaService.deleteById(materia.id);

      this.notifyService.show('Matéria deletada com sucesso!');

      this.resetValues();
    });
  }

  private notify(message: string) {
    this.notifyService.show(message);
  }

  private notifyError() {
    this.notify(this.mensagemErro);
  }
}
