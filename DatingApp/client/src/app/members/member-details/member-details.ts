import { Component, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../_services/MembersService';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-details',
 imports: [RouterLink,AsyncPipe, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css'
})
export class MemberDetails implements OnInit {

    private memberService = inject(MembersService);
     private route = inject(ActivatedRoute);
      private router = inject(Router);
     protected member = signal<Member | undefined>(undefined);
     protected title=signal<string|undefined>('Profile');

       ngOnInit(): void {

        this.route.data.subscribe(
          {
            next:data=>this.member.set(data['member'])
          }
        )


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
