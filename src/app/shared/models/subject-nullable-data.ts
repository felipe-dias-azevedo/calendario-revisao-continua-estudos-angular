import {Subject} from "../services/subject/subject";
import {Subtopic} from "../services/subtopic/subtopic";
import {Materia} from "../services/materia/materia";

export interface SubjectNullableData {
    subject: Subject;
    subtopic: Subtopic | null;
    materia: Materia | null;
}
