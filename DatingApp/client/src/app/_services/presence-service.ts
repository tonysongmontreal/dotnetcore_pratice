import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

    private hubUrl = environment.hubUrl;
  private toast = inject(ToastrService);
  hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);

    createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserOnline', userId => {
      this.onlineUsers.update(users => [...users, userId]);
        this.toast.success(userId+' has connected!');
             

    })

    this.hubConnection.on('UserOffline', userId => {
      this.onlineUsers.update(users => users.filter(x => x !== userId));
       this.toast.success(userId+' Offline!');
    });

    this.hubConnection.on('GetOnlineUsers', userIds => {
      this.onlineUsers.set(userIds);
    });

   this.hubConnection.on('NewMessageReceived', (message: Message) => {
  this.toast.info(
    `${message.senderDisplayName} has sent you a new message`,
    'New Message',
    { timeOut: 10000 }
  );


});



  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error))
    }
  }

}
