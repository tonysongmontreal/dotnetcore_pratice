import { Component, computed, inject, input, Input, model } from '@angular/core';
import { Member } from '../../../_models/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../../core/pipes/age-pipe';
import { LikesService } from '../../../_services/likes-service';
import { PresenceService } from '../../../_services/presence-service';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrls: ['./member-card.css']
})



export class MemberCard {

  private likeService = inject(LikesService);
  private presenceService = inject(PresenceService);
  //member = input.required<Member>();
  member =model<Member|null>();

  protected hasLiked = computed(() => this.likeService.likeIds().includes(this.member()!.id));

  protected onlineUser = computed(() => this.presenceService.onlineUsers());




   protected isOnline = computed(() =>
      this.presenceService.onlineUsers().includes(this.member()!.id!));


    toggleLike(event: Event) {
    event.stopPropagation();
    this.likeService.toggleLike(this.member()!.id).subscribe({
      next: () => {
        if (this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member()!.id))
        } else {
          this.likeService.likeIds.update(ids => [...ids, this.member()!.id])
        }
      }
    })
  }



}
