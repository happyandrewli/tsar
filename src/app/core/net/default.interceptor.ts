import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

const CODEMESSAGE = {
  200: 'Standard response for successful HTTP requests.',
  201: 'The request has been fulfilled, resulting in the creation of a new resource.',
  202: 'The request has been accepted for processing, but the processing has not been completed.',
  204: 'The server successfully processed the request and is not returning any content.',
  400: 'The server cannot or will not process the request due to an apparent client error.',
  401: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
  403: 'The request contained valid data and was understood by the server, but the server is refusing action.',
  404: 'The requested resource could not be found but may be available in the future.',
  406: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.',
  410: 'Indicates that the resource requested is no longer available and will not be available again.',
  422: 'The request was well-formed but was unable to be followed due to semantic errors.',
  500: 'Internal Server Error: A generic error message.',
  502: 'Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
  503: 'Service Unavailable: The server cannot handle the request.',
  504: 'Gateway Timeout: The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.'
};

/**
 * default http interceptor registered in `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }
    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.notification.error(`Request error ${ev.status}: ${ev.url}`, errortext);
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    switch (ev.status) {
      case 200:
        // To-do: business logic layer error processing
        break;
      case 401:
        this.notification.error(`Login expired or hasn't logged in yet. Please log in again.`, ``);
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/exception/${ev.status}`);
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn('unknown issue，most likely it is caused by backend not supporting CORS.', ev);
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(ev);
    } else {
      return of(ev);
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add server prefix
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // Process the request errors all together
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // If everything is ok, then continue
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
