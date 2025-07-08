import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../_models/member';
import { AccountService } from './account';
import { Photo } from '../_models/photo';
import { tap } from 'rxjs';
import { EditableMember } from '../_models/EditableMember';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

   private http= inject(HttpClient);
   private accountService= inject(AccountService);
   baseUrl = environment.apiUrl;
   editMode = signal(false);
    member = signal<Member | null>(null);

getMembers()
{
  return this.http.get<Member[]>(this.baseUrl+'members');
}

 getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'members/' + id).pipe(
      tap(member => {
        this.member.set(member)
      })
    )
  }


 getMemberPhotos(id: string) {

    return this.http.get<Photo[]>(this.baseUrl + 'members/' + id + '/photos');
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members', member);
  }

   uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

   setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'members/set-main-photo/' + photo.id, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'members/delete-photo/' + photoId);
  }


}








