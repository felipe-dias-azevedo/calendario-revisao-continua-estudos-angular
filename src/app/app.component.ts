import {Component, HostBinding, OnInit} from '@angular/core';
import {SubtopicService} from "./shared/services/subtopic/subtopic.service";
import {SubjectService} from "./shared/services/subject/subject.service";
import {MateriaService} from "./shared/services/materia/materia.service";
import {StudiesDaysList, StudyDay, StudyDayContent} from "./shared/components/studies-day-list/studies-day-list";
import {Subject} from "./shared/services/subject/subject";
import {MatDialog} from "@angular/material/dialog";
import {ModalAddComponent} from "./shared/components/modal/add/modal-add.component";
import {ModalRemoveComponent} from "./shared/components/modal/remove/modal-remove.component";
import './shared/extensions/date.extensions';
import './shared/extensions/string.extensions';
import {getTextColorFrom} from "./shared/constants/colors";
import { environment } from '../environments/environment';
import {ModalAlertComponent} from "./shared/components/modal/alert/modal-alert.component";
import {ModalAlertResponse} from "./shared/components/modal/alert/modal-alert-response";
import { ModalImportExportComponent } from './shared/components/modal/import-export/modal-import-export.component';
import {ModalAlertTypeContent} from "./shared/components/modal/alert/modal-alert-type-content";
import {Materia} from "./shared/services/materia/materia";
import {DarkmodeService} from "./shared/services/darkmode/darkmode.service";
import {OverlayContainer} from "@angular/cdk/overlay";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './responsive.css']
})
export class AppComponent implements OnInit {

  title = 'calendario-estudos';

  now!: Date;
  monthsForward!: number;

  subjectPerDayList!: StudiesDaysList;
  currentMonth!: Date;
  textFilter!: string;

  isDev = !environment.production;

  private materias!: Materia[];
  private subjects!: Subject[];

  @HostBinding('class') className = '';

  isDarkOn: boolean = false;

  constructor(
    private dialog: MatDialog,
    private overlay: OverlayContainer,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private darkmodeService: DarkmodeService
  ) {}

  ngOnInit(): void {
    this.now = new Date();
    this.monthsForward = 0;
    this.textFilter = "";

    this.setDarkMode();
    this.getData();
  }

  private setDarkMode() {
    this.darkmodeService.get().subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      this.isDarkOn = darkMode;
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }

  getData() {
    this.materiaService.get().subscribe(m => {
      this.materias = m;
      if (this.subjects === undefined) {
          return;
      }
      this.updateMonth();
    });
    this.subjectService.get().subscribe(s => {
      this.subjects = s.filter(s => s.name.toLowerCase().includes(this.textFilter.toLowerCase()));
      if (this.materias === undefined) {
        return;
      }
      this.updateMonth();
    });
  }

  private getStudyDayForDay(day: number, month: number): StudyDay {
    if (this.subjects.length == 0) {
      return { day, content: [] };
    }

    const subjectsForDay = this.subjects
      .filter(s => s.date.isSameDate(new Date(this.now.getFullYear(), month, day)))
      .map(s => {
        const materia = this.materias.find(m => m.id === s.materiaId) ?? null;
        const color = materia === null ? '#000000' : materia.color;
        const studyDay: StudyDayContent = {
          subject: s,
          color,
          textColor: getTextColorFrom(color)
        }
        return studyDay;
      });
    return { day, content: subjectsForDay };
  }

  private updateMonth() {
    const actualMonth = this.now.getMonth() + this.monthsForward;
    this.currentMonth = this.now.getDateOfMonth(this.monthsForward);

    let studiesDaysData: StudiesDaysList = [];

    for (let day = 1; day <= this.now.daysInMonth(actualMonth); day++) {
      const studyDay = this.getStudyDayForDay(day, actualMonth);
      studiesDaysData = [studyDay, ...studiesDaysData]
    }

    this.subjectPerDayList = studiesDaysData.sort((a, b) => +a.day - +b.day);
  }

  toggleDarkMode() {
    this.darkmodeService.toggle();
  }

  goToTodayTitle(): void {
    if (window.innerWidth >= 700) {
      return;
    }
    this.goToToday();
  }

  goToToday(): void {
    this.monthsForward = 0;
    this.updateMonth();

    const today = this.now.getDate();

    const smoothness: ScrollOptions = { behavior: 'smooth' };

    if ([1, 2].includes(today)) {
      window.scrollTo({ top: 0, ...smoothness });
      return;
    }

    document.getElementById(`dia-${today-2}`)?.scrollIntoView(smoothness);
  }

  nextMonth(): void {
    if (this.now.getMonth() + (this.monthsForward + 1) > 11) {
      return;
    }

    this.monthsForward++;
    this.updateMonth();
  }

  previousMonth(): void {
    if (this.now.getMonth() + (this.monthsForward - 1) < 0) {
      return;
    }

    this.monthsForward--;
    this.updateMonth();
  }

  showRemoveModal() {
    this.dialog.open(ModalRemoveComponent, { panelClass: 'modal-container' });
  }

  showAddModal() {
    this.dialog.open(ModalAddComponent, { panelClass: 'modal-container' });
  }

  openImportExport() {
    this.dialog.open(ModalImportExportComponent, {
      panelClass: 'mini-modal-container'
    });
  }

  resetData() {
    const confirmationDialog = this.dialog.open<ModalAlertComponent, ModalAlertTypeContent, ModalAlertResponse>(ModalAlertComponent, {
      data: {
        typeContent: 'todos os dados',
        nameContent: ''
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm) {
        return;
      }

      this.subjectService.deleteAll();
      this.subtopicService.deleteAll();
      this.materiaService.deleteAll();
    });
  }
}
