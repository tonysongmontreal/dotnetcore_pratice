import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../_models/member';
import { AccountService } from './account';
import { Photo } from '../_models/photo';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

   private http= inject(HttpClient);
   private accountService= inject(AccountService);
   baseUrl = environment.apiUrl;

getMembers()
{
  return this.http.get<Member[]>(this.baseUrl+'members');
}

getMember(id:string)
{

  return this.http.get<Member>(this.baseUrl+'members/'+id);
}

 getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }





}
