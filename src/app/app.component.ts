import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly numberOfNavItem: number = 6;
  private readonly numberOfPage: number = 12;
  private readonly pageTitle: string[][] = [["Dashboard", "Dashboard"], ["Message", "Send message"], ["Proxy", "Proxy Integration"], ["Profiles", "Profiles"]];

  navbarElememtsTable: boolean[] = [true, ...Array(this.numberOfNavItem - 1).fill(false)];
  pageStatusTable: boolean[] = [true, ...Array(this.numberOfPage - 1).fill(false)];
  currentPageIndex: number =0;
   pageDescriptionStr: string = this.pageTitle[0][0] ;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  isActive(navItem: number): boolean {
    return this.navbarElememtsTable[navItem];
  }

  activeNavItem(pageIndex: number) {
    this.navbarElememtsTable = Array(this.numberOfPage).fill(false);
    this.navbarElememtsTable[pageIndex] = true;
    this.currentPageIndex = pageIndex;
    this.pageDescriptionStr =  this.pageTitle[this.currentPageIndex][0]

  }

  navigate(pageIndex: number) {
    this.pageStatusTable = Array(this.numberOfPage).fill(false);
    this.pageStatusTable[pageIndex] = true;
    this.currentPageIndex = pageIndex;
    this.pageDescriptionStr =  this.pageTitle[this.currentPageIndex][0]

  }
  isPageActive(pageIndex: number): boolean {
    return this.pageStatusTable[pageIndex];
  }

  getPageDescription(){
  }

}
