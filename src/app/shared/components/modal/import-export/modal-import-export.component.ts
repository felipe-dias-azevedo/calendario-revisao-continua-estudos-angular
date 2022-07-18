import { Component, OnInit } from '@angular/core';
import {
  FileData,
  FileDataFormated,
  FileMateriaData,
  FileSubjectData,
  FileSubtopicData
} from 'src/app/shared/models/file-data';
import { NotifyService } from 'src/app/shared/services/notify/notify.service';
import {BackupService} from "../../../services/backup/backup.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalImportTableComponent} from "../import-table/modal-import-table.component";
import {SubjectService} from "../../../services/subject/subject.service";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import { saveAs } from "file-saver";
import {Materia} from "../../../services/materia/materia";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {Subject} from "../../../services/subject/subject";
import {FileDataBackup} from "../../../models/file-data-backup";

@Component({
  selector: 'app-modal-import-export',
  templateUrl: './modal-import-export.component.html',
  styleUrls: ['./modal-import-export.component.css']
})
export class ModalImportExportComponent implements OnInit {

  // IMPORT DATA
  importFileName?: string;
  private importFileContent?: string;
  private importData?: FileData | FileDataBackup;
  private isOldBackup?: boolean;

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
    this.isOldBackup = undefined;
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

        const oldBackup = this.backupService.isOldBackup(this.importFileContent);
        const newBackup = this.backupService.isNewBackup(this.importFileContent);

        if (!oldBackup && !newBackup) {
          this.notifyService.show('Os dados não são compatíveis');
          this.resetData();
          return;
        }

        this.isOldBackup = oldBackup;
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

    let materias = data.materias as Materia[];
    let subtopics = data.subtopics as Subtopic[];
    let subjects = data.subjects as Subject[];

    if (this.isOldBackup) {
      materias = this.backupService.formatMateriaData(data.materias as FileMateriaData[]);
      subtopics = this.backupService.formatSubtopicData(data.subtopics as FileSubtopicData[]);
      subjects = this.backupService.formatSubjectData(data.subjects as FileSubjectData[], materias, subtopics);
    }

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
