import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

const busyService = inject(BusyService);

  // if (req.method === 'GET' && !req.url.includes('/photos') ) {
  //   const cachedResponse = cache.get(req.url);
  //   if (cachedResponse) {
  //     return of(cachedResponse);
  //   }
  // }

  busyService.busy();

  return next(req).pipe(
    delay(5),
    tap(response => {
     // cache.set(req.url, response)
    }),
    finalize(() => {
      busyService.idle()
    })
  )
};
