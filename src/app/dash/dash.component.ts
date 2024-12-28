import { Component } from '@angular/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {
  currentTemperature: number = 29;
  minTemperature: number = 16;
  maxTemperature: number = 38;

}
