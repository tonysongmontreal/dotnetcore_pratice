import { HttpClient } from '@angular/common/http';
import { inject, Injectable,signal  } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http= inject(HttpClient);
  private likesService = inject(LikesService);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);



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
  }


  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model,{withCredentials:true}).pipe(
      map(user => {
        if (user) {
       this.setCurrentUser(user);
      this.startTokenRefreshInterval();
        }
      })
    )
  }

    logout() {

    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }

    refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
      {withCredentials: true})
  }

    startTokenRefreshInterval() {
    setInterval(() => {
      this.http.post<User>(this.baseUrl + 'account/refresh-token', {},
        {withCredentials: true}).subscribe({
          next: user => {
            this.setCurrentUser(user)
          },
          error: () => {
            this.logout()
          }
        })
    }, 5 * 60 * 1000)
  }


    private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
  }


}
