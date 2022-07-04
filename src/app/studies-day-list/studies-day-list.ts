import {Subject} from "../subject/subject";

export interface StudyDayContent {
  subject: Subject;
  color: string;
  textColor: string;
}

export interface StudyDay {
  day: number;
  content: StudyDayContent[]
}

export type StudiesDaysList = Array<StudyDay>;
