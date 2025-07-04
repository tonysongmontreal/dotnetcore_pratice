import { Component, inject } from '@angular/core';
import { MembersService } from '../../_services/MembersService';
import { Observable } from 'rxjs';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-list',
  imports: [],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {

    private memberService = inject(MembersService);
  protected members$: Observable<Member[]>;

  constructor() {
    this.members$ = this.memberService.getMembers();
  }

}
