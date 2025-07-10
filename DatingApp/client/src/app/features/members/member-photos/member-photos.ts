import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, combineLatest, switchMap, takeUntil } from 'rxjs';

import { MembersService } from '../../../_services/MembersService';
import { AccountService } from '../../../_services/account';
import { Photo } from '../../../_models/photo';
import { User } from '../../../_models/user';
import { Member } from '../../../_models/member';
import { ImageUpload } from "../../../../shared/image-upload/image-upload";
import { StarButton } from "../../../../shared/star-button/star-button";
import { DeleteButton } from "../../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private photosSubscription?: Subscription;

  protected memberService = inject(MembersService);
  protected accountService = inject(AccountService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit(): void {
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

  onUploadImage(file: File): void {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: (photo: Photo) => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);


    const currentUser = this.accountService.currentUser();
        if (currentUser && currentUser.imageUrl==null ) {

          this.UpdateLocalService(currentUser, photo);


        }


      },
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    });
  }

  private UpdateLocalService(currentUser: User, photo: Photo) {
    currentUser.imageUrl = photo.url;
    this.accountService.currentUser.set(currentUser as User);
    localStorage.setItem('user', JSON.stringify(currentUser as User));
    this.memberService.member.update(member => ({
      ...member,
      imageUrl: photo.url
    }) as Member);
  }

  setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) {


           this.UpdateLocalService(currentUser, photo);


        }
      }
    });
  }

  deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id !== photoId));
      }
    });
  }

  ngOnDestroy(): void {
    this.photosSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
