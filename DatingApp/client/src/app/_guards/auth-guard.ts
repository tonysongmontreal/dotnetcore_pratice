import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {


  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
    const router = inject(Router);

      if (!accountService.isUserInitialized()) {
    return accountService.initializeUser().pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          toastr.error('You shall not pass!');

          router.navigate(['/']);
          return false;
        }
      })
    );
  }

    const currentUser = accountService.currentUser();
  if (currentUser) {
    return true;
  } else {
    toastr.error('You shall not pass!');
    router.navigate(['/']);
    return false;
  }

  // if (accountService.currentUser()) {
  //   return true;
  // } else {
  //   toastr.error('You shall not pass!');
  //   return false;
  // }




};
