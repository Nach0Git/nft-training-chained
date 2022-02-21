import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractRoutingModule } from './contract-routing.module';
import { MainInfoComponent } from './main-info/main-info.component';

@NgModule({
  declarations: [MainInfoComponent],
  imports: [CommonModule, ContractRoutingModule],
})
export class ContractModule {}
