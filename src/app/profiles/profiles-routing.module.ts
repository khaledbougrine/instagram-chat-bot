import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ProfilesComponent} from "./profiles.component";

const routes: Routes = [
  {
    path: 'profiles',
    component: ProfilesComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule {}
