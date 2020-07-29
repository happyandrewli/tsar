import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { Idle } from '@ng-idle/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError } from 'rxjs/operators';
import { DFAPI_AUTH } from 'src/app/api';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private appService: AppService,
    private idle: Idle
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
      remember: [true]
    });
    // this.appService.setUserLoggedIn(false);
    this.idle.stop();
  }

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }

  form: FormGroup;
  error = '';

  submit() {
    this.error = '';
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) {
      return;
    }
    this.http
      .post(`${DFAPI_AUTH}`, {
        username: this.userName.value,
        password: this.password.value,
      })
      .pipe(
        catchError((res) => {
          this.error = 'Invalid username or password';
          return [];
        }),
      )
      .subscribe((res: any) => {
        this.reuseTabService.clear();
        this.tokenService.set({
          token: res.session_token,
          sessionId: res.session_id,
          name: res.name,
          email: res.email,
          id: res.id,
          time: res.last_login_date,
          firstName: res.first_name,
          lastName: res.last_name,
          host: res.host,
          isSysAdmin: res.is_sys_admin,
          isRootAdmin: res.is_root_admin,
          groupMembership: res.groupMembership
        });
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          // this.appService.setUserLoggedIn(true);
          this.idle.watch();
          this.router.navigateByUrl(url);
        });
      });
  }

  ngOnDestroy(): void {
  }
}
