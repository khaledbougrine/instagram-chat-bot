import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';

import { SharedModule } from '../shared/shared.module';
import {MessageComponent} from "./message.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [MessageComponent],
  imports: [CommonModule, SharedModule, MessageRoutingModule,FormsModule]
})
export class MessageModule {}
