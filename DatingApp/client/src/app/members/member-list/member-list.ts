import { Component, inject } from '@angular/core';
import { MembersService } from '../../_services/MembersService';
import { Observable } from 'rxjs';
import { Member } from '../../_models/member';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MemberCard } from "../../features/members/member-card/member-card";


@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe,  MemberCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {

  private memberService = inject(MembersService);
  protected members$: Observable<Member[]>;

  constructor() {

    this.members$ = this.memberService.getMembers();


  //    this.members$.subscribe(members => {
  //   console.log('Members:', members);

  // });


  }

}
