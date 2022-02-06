import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainInfoComponent} from './main-info/main-info.component';
import {IsConnectedGuard} from '../../guards/is-connected.guard';

const routes: Routes = [{
  path: '',
  component: MainInfoComponent,
  canActivate: [IsConnectedGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
