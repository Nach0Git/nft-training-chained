import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ConnectWalletComponent} from './features/connect-wallet/connect-wallet.component';

const routes: Routes = [
  {
    path:'',
    component: ConnectWalletComponent
  },
  {
  path:'contract',
  pathMatch: 'full',
  loadChildren: () => import('./features/contract/contract.module').then(m => m.ContractModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
