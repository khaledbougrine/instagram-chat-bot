import { Injectable } from '@angular/core';
import {Login} from "../core/services/electron/interface/login";

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  login_Profiles_list :string[] =["ljaled","dddddddd","aaaaaaaaaaaaaaaaaaaaaaaaaaa"] ;
  profiles_to_DM_list :Login[] =[];

  constructor() { }
}
