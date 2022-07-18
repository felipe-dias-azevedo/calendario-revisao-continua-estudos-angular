import {Injectable} from '@angular/core';
import {FileData, FileMateriaData, FileSubjectData, FileSubtopicData} from "../../models/file-data";
import {Materia} from "../materia/materia";
import {v4 as uuid} from "uuid";
import {Subtopic} from "../subtopic/subtopic";
import {Subject} from "../subject/subject";
import '../../extensions/date.extensions';
import {FileDataBackup} from "../../models/file-data-backup";

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor() { }

  isNewBackup(content: string): boolean {
    try {
      const value = JSON.parse(content) as FileDataBackup;
      const isNew = this.isNewBackupType(value);
      return value !== undefined && isNew;
    } catch {
      return false;
    }
  }

  private isNewBackupType(object: FileDataBackup): object is FileDataBackup {
    return object.materias.filter(m => m.id !== undefined && m.name !== undefined && m.color !== undefined).length === object.materias.length &&
        object.subtopics.filter(s => s.id !== undefined && s.name !== undefined).length === object.subtopics.length &&
        object.subjects.filter(s => s.id !== undefined && s.parentId !== undefined && s.name !== undefined).length === object.subjects.length;
  }

  isOldBackup(content: string): boolean {
    try {
      const value = JSON.parse(content) as FileData;
      const isOld = this.isOldBackupType(value);
      return value !== undefined && isOld;
    } catch (error) {
      return false;
    }
  }

  private isOldBackupType(object: FileData): object is FileData {
    return object.materias.filter(m => m.materia !== undefined).length === object.materias.length &&
        object.subtopics.filter(m => m.subtopic !== undefined).length === object.subtopics.length &&
        object.subjects.filter(m => m.subject !== undefined).length === object.subjects.length;
  }

  getData(content: string): FileData {
    return JSON.parse(content) as FileData;
  }

  formatMateriaData(materias: FileMateriaData[]): Materia[] {
    if (materias.length === 0) {
      return [];
    }

    return materias.map(m => {
      return {
        id: uuid(),
        name: m.materia,
        color: m.color
      }
    });
  }

  formatSubtopicData(subtopics: FileSubtopicData[]): Subtopic[] {
    if (subtopics.length === 0) {
      return [];
    }

    return subtopics.map(s => {
      return {
        id: uuid(),
        name: s.subtopic
      }
    });
  }

  formatSubjectData(subjects: FileSubjectData[], materias: Materia[], subtopics: Subtopic[]): Subject[] {
    if (subjects.length === 0) {
      return [];
    }

    const subjectsGroup = [...new Set(subjects.map(s => s.subject))];
    let data: Subject[] = [];
    for (const s of subjectsGroup) {
      const parentId = uuid();
      const subjectsGrouped: Subject[] = subjects
          .filter(x => x.subject === s)
          .map(x => {
            const subtopic = subtopics[parseInt(x.subtopic)];
            const materia = materias[parseInt(x.materia)];

            return {
              parentId,
              id: uuid(),
              name: x.subject,
              date: new Date(x.date).addHours(3),
              subtopicId: subtopic?.id ?? '',
              materiaId: materia?.id ?? ''
            }
          });
      data = [...data, ...subjectsGrouped];
    }

    return data;
  }

  generateDownloadFile(materias: Materia[], subtopics: Subtopic[], subjects: Subject[]): string {
    const data = {
      materias,
      subtopics,
      subjects
    }

    return JSON.stringify(data);
  }

  getDownloadFileName(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    return `dados-calendario-revisao-estudos-v2-${date}.json`;
  }
}
