import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public AuthService: AuthService){}

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
  ngOnInit(): void {
    this.authStatusSub= this.AuthService.getAuthStateListener().subscribe(
      authStatus => {
        this.isLoading=false;
      }
    )
  }
  
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
