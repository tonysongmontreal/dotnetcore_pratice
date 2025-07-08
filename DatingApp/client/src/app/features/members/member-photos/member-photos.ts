import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MembersService } from '../../../_services/MembersService';
import { ActivatedRoute } from '@angular/router';
import {  Subscription, switchMap, takeUntil, Subject, combineLatest } from 'rxjs';
import { Photo } from '../../../_models/photo';

import { ImageUpload } from "../../../../shared/image-upload/image-upload";
import { AccountService } from '../../../_services/account';
import { User } from '../../../_models/user';
import { Member } from '../../../_models/member';
import { StarButton } from "../../../../shared/star-button/star-button";
import { DeleteButton } from "../../../../shared/delete-button/delete-button";


@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnDestroy{

  private destroy$ = new Subject<void>();
  protected memberService = inject(MembersService);
    protected accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

private photosSubscription?: Subscription;

ngOnInit(): void {

  //   const memberId = this.route.parent?.snapshot.paramMap.get('id');
  // if (memberId) {
  //   this.photosSubscription =   this.memberService.getMemberPhotos(memberId).subscribe(photos => {
  //     this.photos.set(photos);
  //   });}


 combineLatest([
  this.route.parent!.params,
  this.route.url
])
.pipe(
  switchMap(([params, segments]) => {
    const id = params['id'];
    const path = segments.map(s => s.path).join('/');

    return this.memberService.getMemberPhotos(id);
  }),
  takeUntil(this.destroy$)
)
.subscribe(photos => {

  this.photos.set(photos);
});


}


    onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo:Photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo])
      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.currentUser.set(currentUser as User);
           localStorage.setItem('user', JSON.stringify(currentUser as User));
        this.memberService.member.update(member => ({
          ...member,
          imageUrl: photo.url
        }) as Member)
      }
    })
  }

    deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id !== photoId))
      }
    })
  }




  ngOnDestroy(): void {
    this.photosSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
}


}
