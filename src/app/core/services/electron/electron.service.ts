import {booleanAttribute, Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import {ProfileToDM} from "./interface/ProfileToDM";
import {parse} from "papaparse";
import {Login} from "./interface/login";
import {Proxy} from "./interface/Proxy";
import {BehaviorSubject, Subject} from "rxjs";
const fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  isUserLoading = false
  isProxyLoading = false
  fs!: typeof fs;
  message:string ='';
  profilesToDM: ProfileToDM[] = [];
  sendingMessage:boolean = false;
  private _profilesToDM = new BehaviorSubject<any[]>([]);  // Create a BehaviorSubject for the login list
  public profilesToDM$ = this._profilesToDM.asObservable();




  isProfilesComponentInitialized:boolean = false
  isProxyComponentInitialized:boolean = false


  login: Login[] = [];
  private _login = new BehaviorSubject<any[]>([]);  // Create a BehaviorSubject for the login list
  public login$ = this._login.asObservable();

  private _sendingMessage = new BehaviorSubject<boolean>(false);  // Create a BehaviorSubject for the login list
  public sendingMessage$ = this._sendingMessage.asObservable();

  proxys: Proxy[] = [];
  private _proxyList = new BehaviorSubject<any[]>([]);  // Create a BehaviorSubject for the login list
  public proxyList$ = this._proxyList.asObservable();


  private successSubject = new Subject<boolean>();

  success$ = this.successSubject.asObservable();

  setSuccess(status: boolean) {
    this.successSubject.next(status);
  }
  // Method to update the login list
  private isprofilesLoading: boolean = false;
  updateLoginList(newLoginList: any[]) {
    this._login.next(newLoginList);  // Update the login list and notify subscribers
  }
  undateSendingMessage(newValue:boolean) {
    this._sendingMessage.next(newValue);  // Update the login list and notify subscribers
  }

  updateProfilesToDMList(newLoginList: any[]) {
    this._profilesToDM.next(newLoginList);  // Update the login list and notify subscribers
  }
  updateProxyist(proxyList: any[]) {
    this._proxyList.next(proxyList);  // Update the login list and notify subscribers
  }
  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;

      this.fs = (window as any).require('fs');

      this.childProcess = (window as any).require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);


      });
      this.setupUserListener();
      this.setUploadUserListener();
      this.setUploadProfilesListener()
      this.setupADDProfilesListener()
      this.setUploadProxiesListener()
      this.setupADDProxiesListener()
      this.setupMessageReceivedListener()
      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }
  sendMessage(){
    // this.ipcRenderer.send('email',"hello")
    ipcRenderer.send('send-message', this.message);

  }

  getFirstTwoCharacters(input: string | null | undefined): string {
    if (!input) {
      return ''; // Return an empty string for null or undefined inputs
    }else if(input.length ==  1){
      return input.toUpperCase()
    }
    return input.substring(0, 2).toUpperCase(); // Safely get the first two characters
  }

  clean(type: string){
    if(type ==='PROFILES_TO_DM'){
      this.clearProfile()

    }else if(type === 'LOGIN'){
      this.clearUsers()

    }else if(type === 'PROXY'){
      this.clearProxy()

    }
  }


  // Send "clear-users" event
   clearUsers() {
    this.isUserLoading = true;
    ipcRenderer.send('clear-users');
    ipcRenderer.once('clear-users-reply', (event, response) => {
      this.updateLoginList([])
      this.isUserLoading = false; // Reset loading state
    });
  }
  private setupUserListener(): void {
    ipcRenderer.addListener('add-users-reply', (event, response) => {
      this.isUserLoading = false;
      console.log('add-users-reply')
      console.log('response.message');
      console.log(response.success)
      // console.log(response.users.map((row: any) => {
      //   return row.dataValues
      // }));
      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateLoginList(
          response.users.map((row: any) => {
            return {
              userName: row.dataValues.userName,
              password: row.dataValues.password
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }
  private setUploadUserListener(): void {
    ipcRenderer.addListener('load-users-reply', (event, response) => {
      this.isUserLoading = false;
      console.log('add-users-reply')
      console.log('response.message');
      console.log(response.success)
      // console.log(response.users.map((row: any) => {
      //   return row.dataValues
      // }));
      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateLoginList(
          response.users.map((row: any) => {
            return {
              userName: row.dataValues.userName,
              password: row.dataValues.password
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }
// Send "add-users" event
   addUsers(list:any[]) {
    this.isUserLoading  = true;
    console.log('Sending "add-users" event to main process.');
    ipcRenderer.send('add-users', list);
  }
  loadUser(){
    ipcRenderer.send('load-users');
  }

  clearProfile() {
    this.isUserLoading = true;
    ipcRenderer.send('clear-profiles');
    ipcRenderer.once('clear-profiles-reply', (event, response) => {
      this.updateProfilesToDMList([]);
      this.isUserLoading = false; // Reset loading state
    });
  }

  clearProxy() {
    this.isProxyLoading = true;
    ipcRenderer.send('clear-proxies');
    ipcRenderer.once('clear-proxies-reply', (event, response) => {
      this.updateProxyist([]);
      this.isProxyLoading = false; // Reset loading state
    });
  }
  loadProxy(){
    ipcRenderer.send('load-proxies');
  }
  addProxies(list:any[]) {
    this.isProxyLoading  = true;
    console.log('Sending "add-proxies" event to main process.');
    ipcRenderer.send('add-proxies', list);
  }
  private setupMessageReceivedListener(): void {
    ipcRenderer.addListener('message-received', (event, response) => {

      if (response.success) {
        this.setSuccess(true)
        this.undateSendingMessage(false);

      }else {
        this.setSuccess(false)
        this.undateSendingMessage(false);


      }
        console.log('Yes')

      // } else {
      //   console.log(`Error: ${response.message}`);
      // }
    });
  }

  private setupADDProxiesListener(): void {
    ipcRenderer.addListener('add-proxies-reply', (event, response) => {
      this.isProxyLoading = false;
      console.log(response.success)
      // console.log(response.users.map((row: any) => {
      //   return row.dataValues
      // }));
      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateProxyist(
          response.proxies.map((row: any) => {
            return {
              address: row.dataValues.address,
              port: row.dataValues.port,
              password: row.dataValues.password,
              userName: row.dataValues.userName
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }
  private setUploadProxiesListener(): void {
    ipcRenderer.addListener('load-proxies-reply', (event, response) => {
      this.isProxyLoading = false;

      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateProxyist(
          response.proxies.map((row: any) => {
            return {
              address: row.dataValues.address,
              port: row.dataValues.port,
              userName: row.dataValues.userName,
              password: row.dataValues.password
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }

  private setupADDProfilesListener(): void {
    ipcRenderer.addListener('add-profiles-reply', (event, response) => {
      this.isprofilesLoading = false;
      console.log(response.success)
      // console.log(response.users.map((row: any) => {
      //   return row.dataValues
      // }));
      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateProfilesToDMList(
          response.profiles.map((row: any) => {
            return {
              userName: row.dataValues.userName,
              password: row.dataValues.password
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }
  private setUploadProfilesListener(): void {
    ipcRenderer.addListener('load-profiles-reply', (event, response) => {
      this.isprofilesLoading = false;

      if (response.success) {
        console.log(`success : ${response.message}`);
        this.updateProfilesToDMList(
          response.profiles.map((row: any) => {
            return {
              userName: row.dataValues.userName,
              name: row.dataValues.name
            };
          })
        )

      } else {
        console.log(`Error: ${response.message}`);
      }
    });
  }
  addProfiles(list:any[]) {
    this.isUserLoading  = true;
    console.log('Sending "add-profiles" event to main process.');
    ipcRenderer.send('add-profiles', list);
  }

  loadProfiles(){
    ipcRenderer.send('load-profiles');
  }


  //********************************* CSV ***************************************************


  /**
   * Checks if the given IP address is valid (IPv4 or IPv6).
   * @param ipAddress - The IP address to validate.
   * @returns `true` if the IP address is valid, otherwise `false`.
   */
  isValidIpAddress(ipAddress: any): boolean {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;

    return ipv4Regex.test(ipAddress) || ipv6Regex.test(ipAddress);
  }

  /**
   * Checks if the given value is a valid port number.
   * @param port - The port value to validate.
   * @returns `true` if the port is valid, otherwise `false`.
   */
  isValidPort(port: any): boolean {
    const portNumber = typeof port === 'string' ? parseInt(port, 10) : port;

    // A valid port is an integer between 0 and 65535
    return Number.isInteger(portNumber) && portNumber >= 0 && portNumber <= 65535;
  }

  parseCsv(file: File, type: string): Promise<any[]> {
    console.log('Test');
    const  list :string[]= []
    return new Promise((resolve, reject) => {
      parse(file, {
        header: true, // Include headers as keys
        skipEmptyLines: true,
        complete: (result: any) => {
          // Transform each row into a corresponding object based on the type
          const parsedData = result.data.map((row: any) => {
            // Assuming the first column is for 'Username'
            const firstColumn = row[Object.keys(row)[0]] || '';
            console.log(firstColumn)
            // Assuming the second column is for 'Name'
            let  secondColumn = row[Object.keys(row)[1]] || '';
            if( Array.isArray(secondColumn)){
              secondColumn = secondColumn[0]
            }

            let  column3 = row[Object.keys(row)[2]] || '';
            if( Array.isArray(column3)){
              column3 = column3[0]
            }

            let  column4 = row[Object.keys(row)[3]] || '';
            if( Array.isArray(column4)){
              column4 = column4[0]
            }

            if (secondColumn && firstColumn && firstColumn !='' &&secondColumn !='' && !list.includes(firstColumn)) {
              list.push(firstColumn)
              if (type === 'PROFILES_TO_DM') {
                return {
                  userName: firstColumn,
                  name: secondColumn
                };
              } else if (type === 'LOGIN') {
                return {
                  userName: firstColumn,
                  password: secondColumn
                };
              } else if (type === 'PROXY' && this.isValidIpAddress(firstColumn)&& this.isValidPort(secondColumn)) {
                return {
                  address: firstColumn,
                  port: secondColumn,
                  userName: column3,
                  password: column4
                };
              }else {
                return  null ;

              }
            }else {
              return  null ;
            }
          });


          resolve(parsedData); // Resolve the promise with the processed data
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error);
          reject(error); // Reject the promise in case of error
        },
      });
    });
  }


}
