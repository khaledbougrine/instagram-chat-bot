import {AfterViewChecked, ChangeDetectorRef, Component, input, OnInit} from '@angular/core';
import { parse} from "papaparse";
import {ElectronService} from "../core/services";
import {Login} from "../core/services/electron/interface/login";

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss'
})
export class ProfilesComponent implements  OnInit,AfterViewChecked{
  ngAfterViewChecked(): void {
    this.scrollToElement()

  }
  // login: Login[] = [];

  ngOnInit(): void {
    this.store.login$.subscribe((loginList) => {
      this.store.login = loginList;  // Update the local login list when the service list changes
      this.cdRef.detectChanges();  // Trigger change detection manually

    });
    this.store.profilesToDM$.subscribe((profilesList) => {

      this.store.profilesToDM = profilesList;  // Update the local login list when the service list changes
      this.cdRef.detectChanges();  // Trigger change detection manually

    });
    if(!this.store.isProfilesComponentInitialized){
      this.store.isProfilesComponentInitialized = true;
      this.store.loadUser();
      this.store.loadProfiles();
    }
  }

  constructor(public store:ElectronService, private cdRef: ChangeDetectorRef) { }

  async  onProfileToDmFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const users = await  this.store.parseCsv(file,'PROFILES_TO_DM'); // Wait for the promise to resolve
      await this.store.addProfiles(users)
      input.value = ''
    }
  }

  async onLoginFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const list =  await  this.store.parseCsv(file,'LOGIN');
      this.store.addUsers(list)
      input.value = ''

    }
  }
  scrollToElement() {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }
  }

  cleanLogin(){
    this.store.clean('LOGIN')
  }

  cleanProfileToDm(){
    this.store.clean('PROFILES_TO_DM')
  }
}
