import { Component, ElementRef, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { TitleService, VERSION as VERSION_ALAIN } from '@delon/theme';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { filter } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
  <nz-modal [(nzVisible)]="isVisible" nzTitle="You Have Been Idle!" [nzFooter]="modalFooter">
    <p>{{idleState}}</p>
  </nz-modal>
  <ng-template #modalFooter>
    <button nz-button nzType="primary" (click)="logout()" nzDanger>Logout</button>
    <button nz-button nzType="primary" (click)="stay()">Stay</button>
  </ng-template>`,
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private idle: Idle, private keepalive: Keepalive, private appService: AppService,
    private injector: Injector
  ) {
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);



    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(15);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.isVisible = false;
      this.idleState = 'Timed out!';
      this.timedOut = true;
      (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
      console.log(this.idleState);
      this.injector.get(Router).navigate(['/passport/login']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      console.log(this.idleState);
      this.isVisible = true;
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    // this.appService.getUserLoggedIn().subscribe(userLoggedIn => {
    //   console.log("get here");
    //   if (userLoggedIn) {
    //     idle.watch()
    //     this.timedOut = false;
    //   } else {
    //     idle.stop();
    //   }
    // })
    this.reset();
  }
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  isVisible = false;
  ngOnDestroy(): void {
    (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
  }

  ngOnInit() {
    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleSrv.setTitle();
      this.modalSrv.closeAll();
    });
  }

  stay() {
    this.isVisible = false;
    this.reset();
  }

  logout() {
    this.isVisible = false;
    (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
    this.injector.get(Router).navigate(['/passport/login']);
  }

  reset() {
    this.idle.watch();
    // this.idleState = 'Started.';
    this.timedOut = false;
  }
}
