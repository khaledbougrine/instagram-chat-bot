import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import {MessageRoutingModule} from "./message/message-routing.module";
import {ProxyRoutingModule} from "./proxy/proxy-routing.module";
import {DashRoutingModule} from "./dash/dash-routing.module";
import {ProfilesRoutingModule} from "./profiles/profiles-routing.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule,
    DetailRoutingModule,
    MessageRoutingModule,
    ProxyRoutingModule,
    DashRoutingModule,
    ProfilesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
