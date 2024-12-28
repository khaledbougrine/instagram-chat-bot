import { Component, OnInit } from '@angular/core';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(public store:ElectronService) { }

  ngOnInit(): void {
    console.log('DetailComponent INIT');
   }

   onclike(){
     console.log('YES')
     // this.electronService.sendMessage()

   }

}
