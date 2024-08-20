import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = false;
  constructor(public AuthService: AuthService){}

  onLogin(form: NgForm) {
    if(!form.invalid){
      this.isLoading=true;
      this.AuthService.login(form.value.email,form.value.password)
    }
    else{
      return;
    }
  }
}
