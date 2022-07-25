import {IdentifiableContext} from "../context-storage/identifiable-context";

export interface NewSubject {
  name: string;
  subtopicId: string;
  materiaId: string;
  date: Date;
  comments?: string;
}

export interface SubjectStructure extends NewSubject {
  notes?: string;
}

export interface PreSubject extends SubjectStructure {
  parentId: string;
}

export interface Subject extends IdentifiableContext, PreSubject {}
