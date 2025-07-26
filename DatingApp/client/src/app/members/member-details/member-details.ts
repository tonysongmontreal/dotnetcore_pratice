import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { filter } from 'rxjs';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account';
import { MembersService } from '../../_services/MembersService';
import { PresenceService } from '../../_services/presence-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LikesService } from '../../_services/likes-service';

@Component({
  selector: 'app-member-details',
 imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit {


     private route = inject(ActivatedRoute);
      private router = inject(Router);
     protected member = signal<Member | undefined>(undefined);
     protected title=signal<string|undefined>('Profile');
     private routeId=signal<string|null>(null);
      private accountService = inject(AccountService);
        protected memberService = inject(MembersService);
          protected presenceService = inject(PresenceService);
           private likeService = inject(LikesService);

             protected hasLiked = computed(() => this.likeService.likeIds().includes(this.routeId()!));

      protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  })

  constructor() {

    this.route.paramMap.pipe(takeUntilDestroyed())
    .subscribe(parame=>{

      this.routeId.set(parame.get('id'));
    })


     effect(() => {
    const currentMember = this.memberService.member();
    this.member.set(currentMember as Member);
  });


  }

       ngOnInit(): void {

        this.title.set(this.route.firstChild?.snapshot?.title);

      this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
       }


}
