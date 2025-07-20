import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toast = inject(ToastrService);

  if (accountService.currentUser()?.roles.includes('Admin')
    || accountService.currentUser()?.roles.includes('Moderator')) {
      return true;
  } else {
    toast.error('Enter this area, you cannot');
    return false;
  }
};
