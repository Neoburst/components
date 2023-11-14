import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NbTableComponent } from './components/nb-table/nb-table.component';
import { PlaygroundComponent } from './playground/playground.component';
import { InputComponent } from './components/input/input.component';
import { NbInputModule } from 'projects/nb-input/src/lib/nb-input.module';
import { NbTableModule } from 'projects/nb-table/src/lib/nb-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, NbTableComponent, PlaygroundComponent, InputComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule, NbInputModule, NbTableModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }