import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StudiesDayListComponent } from './studies-day-list/studies-day-list.component';
import { ModalDetailsSubjectComponent } from './modal/details-subject/modal-details-subject.component';
import { ModalRemoveComponent } from './modal/remove/modal-remove.component';
import { ModalAddComponent } from './modal/add/modal-add.component';
import {FormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import { ModalAlertComponent } from './shared/components/modal-alert/modal-alert.component';
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    StudiesDayListComponent,
    ModalDetailsSubjectComponent,
    ModalRemoveComponent,
    ModalAddComponent,
    ModalAlertComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatListModule,
    MatTooltipModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
