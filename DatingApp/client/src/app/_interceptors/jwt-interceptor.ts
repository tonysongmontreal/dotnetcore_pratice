import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {


   const accountService = inject(AccountService);

  const user = accountService.currentUser();

  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      },
         withCredentials: true
    })
  }

  return next(req);
};
