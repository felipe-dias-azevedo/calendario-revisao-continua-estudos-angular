import {IdentifiableContext} from "../context-storage/identifiable-context";

export interface NewMateria {
  name: string;
  color: string;
}

export interface Materia extends IdentifiableContext, NewMateria {}
