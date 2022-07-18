import {Subject} from "../services/subject/subject";
import {Materia} from "../services/materia/materia";
import {Subtopic} from "../services/subtopic/subtopic";

export interface FileDataBackup {
    subjects: Subject[];
    materias: Materia[];
    subtopics: Subtopic[];
}