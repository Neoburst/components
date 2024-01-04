import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaygroundComponent } from './playground/playground.component';
import { NbTableComponent } from './components/nb-table/nb-table.component';
import { InputComponent } from './components/input/input.component';
import { GridComponent } from './components/grid/grid.component';

const routes: Routes = [
  {
    path: '',
    component: PlaygroundComponent,
    children: [
      { path: 'grid', component: GridComponent },
      { path: 'input', component: InputComponent },
      { path: 'table', component: NbTableComponent },
    ]
  },
  // { path: '*', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
