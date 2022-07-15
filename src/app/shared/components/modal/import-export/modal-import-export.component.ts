import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileData } from 'src/app/shared/models/file-data';
import { NotifyService } from 'src/app/shared/services/notify/notify.service';

@Component({
  selector: 'app-modal-import-export',
  templateUrl: './modal-import-export.component.html',
  styleUrls: ['./modal-import-export.component.css']
})
export class ModalImportExportComponent implements OnInit {

  @ViewChild('uploadInput') uploadInput!: ElementRef;

  fileName?: string;
  private fileContent?: string;
  private importData?: FileData;

  importLoading!: boolean;

  constructor(
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    this.resetData();
  }

  private resetData() {
    this.fileName = undefined;
    this.fileContent = undefined;
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
      
      this.fileName = file.name;

      let reader = new FileReader();
      reader.onload = () => {

        this.fileContent = reader.result as string;

        if (this.fileContent?.trim() === '') {
          this.notifyService.show('O arquivo está vázio');
          this.resetData();
          return;
        }
  
        this.importData = JSON.parse(this.fileContent!) as FileData;
  
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
    if (data.materias.length > 0) {

    }

    if (data.subtopics.length > 0) {

    }

    if (data.subjects.length > 0) {
      
    }
  }

  downloadData() {
    
  }
}
