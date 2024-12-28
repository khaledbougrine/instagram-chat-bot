import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProxyRoutingModule } from './proxy-routing.module';

import { SharedModule } from '../shared/shared.module';
import {ProxyComponent} from "./proxy.component";

@NgModule({
  declarations: [ProxyComponent],
  imports: [CommonModule, SharedModule, ProxyRoutingModule]
})
export class ProxyModule {}
