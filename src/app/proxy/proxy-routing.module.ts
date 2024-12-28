import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ProxyComponent} from "./proxy.component";

const routes: Routes = [
  {
    path: 'proxy',
    component: ProxyComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProxyRoutingModule {}
