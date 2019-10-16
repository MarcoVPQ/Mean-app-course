import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './../material.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
    declarations:[
        LoginComponent,
        SignupComponent
    ],
    imports: [
    CommonModule,
        RouterModule,
        FormsModule,
        MaterialModule,
        AuthRoutingModule
    ]
})
export class AuthModule {}