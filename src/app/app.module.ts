import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgTableComponent } from './components/ng-table/ng-table.component';
import { NbTableComponent } from './components/nb-table/nb-table.component';
import { NbTableModule } from 'projects/nb-table/src/public-api';

@NgModule({
  declarations: [AppComponent, NgTableComponent, NbTableComponent],
  imports: [BrowserModule, AppRoutingModule, MatTableModule, NbTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }