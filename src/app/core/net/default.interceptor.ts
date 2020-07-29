import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, take } from 'rxjs/operators';

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

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }

  // 是否开启当 Token 过期后重新调用刷新 Token 接口，并在刷新 Token 后再一次发起请求
  private refreshTokenEnabled = true;
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase) {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401 || ev.status === 500) {
      return;
    }
    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    this.notification.error(`Request error ${ev.status}: ${ev.url}`, errortext);
  }
  private tryRefreshToken(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
    if (!this.refreshTokenEnabled || [`/api/auth/refresh`].some((url) => req.url.includes(url))) {
      this.toLogin();
      return throwError(ev);
    }
    // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
    if (this.refreshToking) {
      return this.refreshToken$.pipe(
        filter((v) => !!v),
        take(1),
        switchMap(() => next.handle(this.reAttachToken(req))),
      );
    }
    // 3、尝试调用刷新 Token
    this.refreshToking = true;
    this.refreshToken$.next(null);

    return this.refreshTokenRequest().pipe(
      switchMap((res) => {
        // 通知后续请求继续执行
        this.refreshToking = false;
        this.refreshToken$.next(res);
        // 重新保存新 token
        this.tokenSrv.set(res);
        // 重新发起请求
        return next.handle(this.reAttachToken(req));
      }),
      catchError((err) => {
        this.refreshToking = false;
        this.toLogin();
        return throwError(err);
      }),
    );
  }

  /**
   * 刷新 Token 请求
   */
  private refreshTokenRequest(): Observable<any> {
    const model = this.tokenSrv.get();
    return this.http.post(`/api/auth/refresh`, null, null, { headers: { refresh_token: model.refresh_token || '' } });
  }

  /**
   * 重新附加新 Token 信息
   *
   * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
   */
  private reAttachToken(req: HttpRequest<any>): HttpRequest<any> {
    // 以下示例是以 NG-ALAIN 默认使用 `SimpleInterceptor`
    const token = this.tokenSrv.get().token;
    return req.clone({
      setHeaders: {
        token: `Bearer ${token}`,
      },
    });
  }

  private toLogin(): void {
    this.notification.error(`Login expired or hasn't logged in yet. Please log in again.`, ``);
    this.goTo('/passport/login');
  }

  private handleData(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }
    this.checkStatus(ev);
    switch (ev.status) {
      case 200:
        // To-do: business logic layer error processing
        break;
      case 401:
      case 500: // DreamFactory returns 500 error code if user enters a invalid password
        // this.notification.error(`Login expired or hasn't logged in yet. Please log in again.`, ``);
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        // return this.tryRefreshToken(ev, req, next);
        // this.notification.error(`Login expired or hasn't logged in yet. Please log in again.`, ``);
        // this.goTo('/passport/login');
        // this.injector.get(Router).navigateByUrl('/passport/login');
        this.injector.get(Router).navigate(['/passport/login']);
        break;
      case 403:
      case 404:
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
      mergeMap((ev) => {
        // 允许统一对请求错误处理
        if (ev instanceof HttpResponseBase) {
          return this.handleData(ev, newReq, next);
        }
        // 若一切都正常，则后续操作
        return of(ev);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err, newReq, next)),
    );
  }
}
