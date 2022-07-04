import {IdentifiableContext} from "../context-storage/identifiable-context";

export interface NewSubtopic {
  name: string;
}

export interface Subtopic extends IdentifiableContext, NewSubtopic {}
