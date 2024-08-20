import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthData } from "./auth-data.model";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
@Injectable({providedIn:'root'})
export class AuthService{
    private token:string | null;
    private authStateListener= new Subject<boolean>();
    private isAuthenticated: boolean = false;
    private tokenTimer:any;

    constructor(private http: HttpClient, private router: Router){}
    getAuthStateListener(){
        console.log(this.authStateListener.asObservable());
        return this.authStateListener.asObservable();
    }
    getToken(){
        return this.token;
    }
    getIsAuth() {
        return this.isAuthenticated;
      }
    
    createrUser(email: String, password: String){
        const authData: AuthData= {email: email, password: password}; 
        this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(res=>
                console.log(res)
            )
        this.router.navigate(['/login']);
    }

    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http
          .post<{ token: string; expiresIn: number }>(
            "http://localhost:3000/api/users/login",
            authData
          )
          .subscribe(response => {
            const token = response.token;
            this.token = token;
            if (token) {
              const expiresInDuration = response.expiresIn;
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.authStateListener.next(true);
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
              console.log(expirationDate);
              this.saveAuthData(token, expirationDate);
              this.router.navigate(["/"]);
            }
          });
      }
    
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStateListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStateListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
