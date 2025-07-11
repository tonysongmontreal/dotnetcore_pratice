import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { filter } from 'rxjs';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account';
import { MembersService } from '../../_services/MembersService';

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
      private accountService = inject(AccountService);
        protected memberService = inject(MembersService);

      protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  })

  constructor() {


     effect(() => {
    const currentMember = this.memberService.member();
    this.member.set(currentMember as Member);
  });



  }

       ngOnInit(): void {

      // this.member.set(this.memberService.member()!)



        // this.route.data.subscribe(
        //   {
        //     next:data=>this.member.set(data['member'])
        //   }
        // )


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
