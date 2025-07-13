import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../_models/member';
import { CommonModule } from '@angular/common';
import { EditableMember } from '../../../_models/EditableMember';
import { MembersService } from '../../../_services/MembersService';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../_services/account';
import { ToastrService } from 'ngx-toastr';
import { TimeAgoPipe } from "../../../../core/pipes/time-ago-pipe";

@Component({
  selector: 'app-member-profile',
  imports: [CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit , OnDestroy  {

   @ViewChild('editForm') editForm?: NgForm;

   @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

   private route = inject(ActivatedRoute);
    protected memberService = inject(MembersService);
      private accountService = inject(AccountService);
       private toastr = inject(ToastrService);
  protected member = signal<Member | undefined>(undefined);

    protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: ''
  }


  // ngOnInit(): void {
  //   this.route.parent?.data.subscribe(data => {
  //     this.member.set(data['member']);
  //   })
  // }
   ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    }

  }

  updateProfile() {


  if (!this.memberService.member()) return;

  const member = this.memberService.member()!;
   const updatedMember = { ...member, ...this.editableMember };


  this.memberService.updateMember(this.editableMember).subscribe({
    next: () => {
      const currentUser = this.accountService.currentUser();
      if (currentUser && updatedMember.displayName !== currentUser?.displayName) {
        currentUser.displayName = updatedMember.displayName;
        this.accountService.currentUser.set(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
      }
      this.toastr.success('Profile updated successfully');
      this.memberService.editMode.set(false);
      this.memberService.member.set(updatedMember);
      this.editForm?.reset(updatedMember);
    }
  });

  }

   ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }

}
