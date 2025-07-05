import { ResolveFn, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { inject } from '@angular/core';
import { MembersService } from '../../_services/MembersService';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member> = (route, state) => {

   const memberService = inject(MembersService);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');

  if (!memberId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return memberService.getMember(memberId);
};
