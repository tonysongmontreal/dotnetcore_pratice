import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';
import { LikesService } from '../_services/likes-service';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

   const busyService = inject(BusyService);


  const generateCacheKey = (url: string, params: HttpParams): string => {

    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  // const cacheKey = generateCacheKey(req.url, req.params);

  // if (req.method === 'GET') {
  //   const cachedResponse = cache.get(cacheKey);
  //   if (cachedResponse) {
  //     return of(cachedResponse);
  //   }
  // }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
     // cache.set(cacheKey, response);
     // likesService.getLikeIds();
    }),
    finalize(() => {
      busyService.idle()
    })
  )
};
