import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NewStateShowModal, ShowModal} from "./show-modal";

@Injectable({
  providedIn: 'root'
})
export class StateModalShownService {

  private stateModalShown = new BehaviorSubject<ShowModal>({
    add: false,
    remove: false,
    detailsSubject: false
  });
  modalShown = this.stateModalShown.asObservable();

  constructor() { }

  updateState(state: NewStateShowModal) {
    const newState: ShowModal = {
      add: state.add || false,
      remove: state.remove || false,
      detailsSubject: state.detailsSubject || false
    }
    this.stateModalShown.next(newState);
  }
}
