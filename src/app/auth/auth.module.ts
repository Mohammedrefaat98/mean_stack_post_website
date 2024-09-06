import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-module.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AngularMaterialModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
