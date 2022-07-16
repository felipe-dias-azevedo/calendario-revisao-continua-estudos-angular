import {Injectable} from '@angular/core';
import {FileData, FileMateriaData, FileSubjectData, FileSubtopicData} from "../../models/file-data";
import {Materia} from "../materia/materia";
import {v4 as uuid} from "uuid";
import {Subtopic} from "../subtopic/subtopic";
import {Subject} from "../subject/subject";
import '../../extensions/date.extensions';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor() { }

  isOldBackup(content: string): boolean {
    try {
      const value = JSON.parse(content) as FileData;
      return value !== undefined;
    } catch (error) {
      return false;
    }
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
}
