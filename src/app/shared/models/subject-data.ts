import {Subject} from "../services/subject/subject";
import {Materia} from "../services/materia/materia";
import {Subtopic} from "../services/subtopic/subtopic";

export interface SubjectData {
    subject: Subject;
    subtopic: Subtopic;
    materia: Materia;
}
