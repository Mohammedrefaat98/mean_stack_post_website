import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isLoading = false;
  constructor(public AuthService: AuthService){}
  
  onSignup(form: NgForm) {
    if(!form.invalid){
      this.isLoading=true;
      this.AuthService.createrUser(form.value.email,form.value.password)
    }
    else{
      return;
    }
  }
}
