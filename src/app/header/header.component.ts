import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  authenticatedUser: boolean = false

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.authenticatedUser = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe( isAuth => {
      this.authenticatedUser = isAuth
    })
  }

  ngOnDestroy(): void {
    this.authListenerSubs
    .unsubscribe()
    
  }

  onLogout(){
   this.authService.logout()
  }

}
