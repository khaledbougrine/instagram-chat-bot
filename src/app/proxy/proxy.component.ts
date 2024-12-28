import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrl: './proxy.component.scss'
})
export class ProxyComponent  implements  OnInit {
  constructor(public store:ElectronService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.store.proxyList$.subscribe((proxyList) => {
      this.store.proxys = proxyList;  // Update the local login list when the service list changes
      this.cdRef.detectChanges();  // Trigger change detection manually

    });
    if(!this.store.isProxyComponentInitialized){
      this.store.loadProxy();
      this.store.isProxyComponentInitialized = true;
    }


  }



  cleanProx() {
    this.store.clean('PROXY')
  }

  async onProxyFileSelected($event: Event) {
    const input = $event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const list =  await  this.store.parseCsv(file,'PROXY');
      this.store.addProxies(list)
      input.value = ''

    }
  }
}
