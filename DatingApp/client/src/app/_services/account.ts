import { HttpClient } from '@angular/common/http';
import { inject, Injectable,signal  } from '@angular/core';
import { User } from '../_models/user';
import { catchError, map, Observable, of, tap } from 'rxjs';
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

    private isInitialized = signal<boolean>(false); // 添加初始化状态

  // 改为同步方法，返回 Observable
  initializeUser(): Observable<User | null> {
    if (this.isInitialized()) {
      return of(this.currentUser());
    }

    return this.refreshToken().pipe(
      tap(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        this.isInitialized.set(true);
      }),
      catchError(error => {
        console.log('No valid session found');
        this.isInitialized.set(true);
        return of(null);
      })
    );
  }

    isUserInitialized(): boolean {
    return this.isInitialized();
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
