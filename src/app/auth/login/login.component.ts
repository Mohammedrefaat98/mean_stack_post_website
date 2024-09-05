import { Component , OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{
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
