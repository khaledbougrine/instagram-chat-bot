import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements  OnInit{
 emptyLists: Set<string> = new Set();

  ngOnInit(): void {
    this.store.proxyList$.subscribe((proxyList) => {
      if (proxyList.length === 0) {
        this.emptyLists.add('🌐 Proxy list');
      }else {
        this.emptyLists.delete('🌐 Proxy list');
      }
      this.cdRef.detectChanges();  // Trigger change detection manually
    });
    this.store.login$.subscribe((loginList) => {
      if (loginList.length === 0) {
        this.emptyLists.add('🔑 User login list');
      }else {
        this.emptyLists.delete('🔑 User login list');

      }
      this.cdRef.detectChanges();  // Trigger change detection manually

    });
    this.store.profilesToDM$.subscribe((profilesList) => {
      if (profilesList.length === 0) {
        this.emptyLists.add('💌 Profiles to DM list');
      }else {
        this.emptyLists.delete('💌 Profiles to DM list');

      }
      this.cdRef.detectChanges();  // Trigger change detection manually

    });

    this.store.sendingMessage$.subscribe(value => {
      console.log(value)
      this.store.sendingMessage = value;
      this.cdRef.detectChanges();
    })
    if(!this.store.isProxyComponentInitialized){
      this.store.isProxyComponentInitialized = true;
      this.store.loadProxy();
      this.cdRef.detectChanges();

    }
    if(!this.store.isProfilesComponentInitialized){
      this.store.isProfilesComponentInitialized = true;
      this.store.loadUser();
      this.store.loadProfiles();
      this.cdRef.detectChanges();
    }
    this.store.success$.subscribe(success => {
      if (success) {
        this.processCompleted()
      } else {
        this.showError()
      }
    });



  }


  constructor(public store:ElectronService, private cdRef: ChangeDetectorRef) { }

  showAlert() {
    Swal.fire({
      title: 'Write Your Message',
      text: 'Please enter your message below.',
      icon: 'info',
      input: 'text',
      inputPlaceholder: 'Type your message here...',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Message sent:', result.value); // Handle the input value
      } else {
        console.log('Message not sent');
      }
    });
  }

  sendMessage(){


    // Check for empty login list
    // if (this.store.login.length === 0) {
    //   this.emptyLists.push('🔑 User login list');
    // }

    // Check for empty profile list
    // if (this.store.profilesToDM.length === 0) {
    //   this.emptyLists.push('💌 Profiles to DM list');
    // }

    // Check for empty proxy list

    if (this.emptyLists.size > 0) {
      this.showWarning(Array.from(this.emptyLists));
    } else {
      this.store.undateSendingMessage(true)
      this.store.sendingMessage = true;
      this.store.sendMessage()
    }
  }
  showWarning(emptyLists: string[]) {
    let listMessage = emptyLists.join('<br>'); // Join empty list names with line breaks for better formatting

    Swal.fire({
      title: '<strong><i class="fa fa-exclamation-triangle" style="color: #f39c12;"></i> ⚠️ Oops! Some Lists Are Empty!</strong>', // Custom title with icon
      html: `It looks like the following lists are missing:<br><br><strong>${listMessage}</strong><br><br>Please make sure to upload the necessary lists before proceeding.`,
      icon: 'warning',
      background: '#fff3cd', // Light yellow background color for warning
      color: '#856404',       // Dark yellow text color
      timer: 4000,
      position: 'top', // Auto close after 5 seconds
      timerProgressBar: true, // Show a progress bar as the timer counts down
      showCloseButton: false,  // Show close button in the corner (optional)
      showCancelButton: false, // Disable cancel button
      allowOutsideClick: true, // Allow closing the popup by clicking outside
      showConfirmButton:false,
      didClose: () => {
        console.log('Warning alert closed');
      },

    });
  }
  processCompleted() {
    Swal.fire({
      title: 'Messages Sent!',
      text: 'Your messages have been successfully sent.',
      icon: 'success',
      showConfirmButton:false,
      position: 'top', // Display at the top of the screen
      timer: 3000, // Automatically close after 3 seconds
    });
  }
  processFailed() {
    Swal.fire({
      title: 'Failed to Send Messages!',
      text: 'There was an error while sending the messages. Please try again.',
      icon: 'error',
      confirmButtonText: 'Retry', // Option to retry the process
      position: 'top', // Display at the top of the screen
      timer: 5000, // Keep the popup for 5 seconds
      timerProgressBar: true, // Show a progress bar while waiting
    });
  }
  changeMessage(event: Event): void {
    this.store.message = (event.target as HTMLTextAreaElement).value;
    this.cdRef.detectChanges();

  }
  showError() {
    Swal.fire({
      title: 'Error!',
      text: 'Failed to send the message. Please try again later.',
      icon: 'error',
      showConfirmButton:false,
      position: 'top', // Display at the top of the screen
      timer: 3000, // Automatically close after 3 seconds
    });
  }
}
