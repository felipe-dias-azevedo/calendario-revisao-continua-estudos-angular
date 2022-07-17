import { Component, OnInit } from '@angular/core';
import {FileData, FileDataFormated} from 'src/app/shared/models/file-data';
import { NotifyService } from 'src/app/shared/services/notify/notify.service';
import {BackupService} from "../../../services/backup/backup.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalImportTableComponent} from "../import-table/modal-import-table.component";
import {SubjectService} from "../../../services/subject/subject.service";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import { saveAs } from "file-saver";

@Component({
  selector: 'app-modal-import-export',
  templateUrl: './modal-import-export.component.html',
  styleUrls: ['./modal-import-export.component.css']
})
export class ModalImportExportComponent implements OnInit {

  // IMPORT DATA
  importFileName?: string;
  private importFileContent?: string;
  private importData?: FileData;

  importLoading!: boolean;

  constructor(
    private backupService: BackupService,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.resetData();
  }

  private resetData() {
    this.importFileName = undefined;
    this.importFileContent = undefined;
    this.importData = undefined;
    this.importLoading = false;
  }

  readData(event: Event) {
    try {
      this.importLoading = true;
      const element = event.currentTarget as HTMLInputElement;
      
      if (element.files === undefined || element.files?.length === 0) {
        this.resetData();
        return;
      }

      if (element.files!.length! > 1) {
        this.notifyService.show('Não é possível importar mais de um arquivo');
        this.resetData();
        return;
      }

      const file: File = element.files![0];

      if (file.type !== 'application/json') {
        this.notifyService.show('Só é possível importar arquivos JSON');
        this.resetData();
        return;
      }
      
      this.importFileName = file.name;

      let reader = new FileReader();
      reader.onload = () => {

        this.importFileContent = reader.result as string;

        if (this.importFileContent === undefined || this.importFileContent?.trim() === '') {
          this.notifyService.show('O arquivo está vázio');
          this.resetData();
          return;
        }

        if (!this.backupService.isOldBackup(this.importFileContent)) {
          this.notifyService.show('Os dados não são compatíveis');
          this.resetData();
          return;
        }
  
        this.importData = this.backupService.getData(this.importFileContent);
  
        this.importLoading = false;
      }
      reader.readAsText(file);

    } catch (error) {
      console.error(error);

      this.notifyService.show('Houve um erro ao obter os dados do arquivo');
      this.resetData();
    }
  }

  uploadData() {
    const data = this.importData!;
    this.importLoading = true;

    const materias = this.backupService.formatMateriaData(data.materias);
    const subtopics = this.backupService.formatSubtopicData(data.subtopics);
    const subjects = this.backupService.formatSubjectData(data.subjects, materias, subtopics);

    if (materias.length === 0 && subtopics.length === 0 && subjects.length === 0) {
      this.notifyService.show('Dados estão vazios');
      this.resetData();
      return;
    }

    const importTableDialog = this.dialog.open<ModalImportTableComponent, FileDataFormated, FileDataFormated>(ModalImportTableComponent, {
      panelClass: 'modal-container',
      data: {
        subjects,
        materias,
        subtopics
      }
    });
    importTableDialog.afterClosed().subscribe(result => {
      if (result === undefined) {
        this.importLoading = false;
        return;
      }

      result.materias.forEach(m => this.materiaService.add(m));
      result.subtopics.forEach(s => this.subtopicService.add(s));
      result.subjects.forEach(s => this.subjectService.add(s));

      this.notifyService.show('Dados importados com sucesso!');
      this.resetData();
    });
  }

  downloadData() {
    const materias = this.materiaService.get();
    const subtopics = this.subtopicService.get();
    const subjects = this.subjectService.get();

    const data = this.backupService.generateDownloadFile(materias, subtopics, subjects);
    const fileName = this.backupService.getDownloadFileName();

    const content = new Blob([data], { type: 'text/json' });
    saveAs(content, fileName);
  }
}
