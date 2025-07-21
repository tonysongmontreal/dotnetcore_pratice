import { HttpClient } from '@angular/common/http';
import { inject, Injectable,signal  } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';
import { PresenceService } from './presence-service';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http= inject(HttpClient);
  private likesService = inject(LikesService);
    private presenceService = inject(PresenceService);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

    async initializeUser() {
    try {
      // 尝试使用 cookie 中的 refresh token 获取用户信息
      const user = await this.refreshToken().toPromise();
      if (user) {
        this.setCurrentUser(user);
      }
    } catch (error) {
      // 如果失败，用户未登录
      console.log('No valid session found');
    }
  }




    register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model,
      {withCredentials:true}).pipe(
      map(user => {
        if (user) {
         this.setCurrentUser(user);
              this.startTokenRefreshInterval();
        }
        return user;
      })
    )
  }

   setCurrentUser(user: User) {
    user.roles=this.getRolesFromToken(user)
    this.currentUser.set(user);
    this.likesService.getLikeIds();
      if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected) {
      this.presenceService.createHubConnection(user)
    }
  }


  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model,{withCredentials:true}).pipe(
      map(user => {
        if (user) {
       this.setCurrentUser(user);
      this.startTokenRefreshInterval();
        }

           return user;
      })
    )
  }

    logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}, {
      withCredentials: true // 清除服务器端 cookie
    }).pipe(
      map(() => {
        localStorage.removeItem('filters');
         this.likesService.clearLikeIds();
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
      })
    );
  }


  //   logout() {

  //   localStorage.removeItem('filters');
  //   this.likesService.clearLikeIds();
  //   this.currentUser.set(null);
  //   this.presenceService.stopHubConnection();
  // }

    refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
      {withCredentials: true})
  }

    private refreshIntervalId?: number;

    startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
        {withCredentials: true}).subscribe({
          next: user => {
            this.setCurrentUser(user)
          },
          error: () => {
             this.logout().subscribe(); // 自动登出
          }
        })
    }, 5 * 60 * 1000)
  }

    stopTokenRefreshInterval() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = undefined;
    }
  }


    private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }


}
