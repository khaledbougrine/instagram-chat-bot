import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';

import { SharedModule } from '../shared/shared.module';
import {ProfilesComponent} from "./profiles.component";

@NgModule({
  declarations: [ProfilesComponent],
  imports: [CommonModule, SharedModule, ProfilesRoutingModule]
})
export class ProfilesModule {}
