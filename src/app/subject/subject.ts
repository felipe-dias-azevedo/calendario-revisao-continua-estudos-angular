import {IdentifiableContext} from "../shared/context-storage/identifiable-context";

export interface NewSubject {
  name: string;
  subtopicId: string;
  materiaId: string;
  date: Date;
}

export interface Subject extends IdentifiableContext, NewSubject {}
