import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthData } from "./auth-data.model";
import { Observable, Subject } from "rxjs";
@Injectable({providedIn:'root'})
export class AuthService{
    private token:string;
    private authStateListener= new Subject<boolean>();
    private isAuthenticated: boolean = false;

    constructor(private http: HttpClient){}
    getToken(){
        return this.token;
    }
    getIsAuth() {
        return this.isAuthenticated;
      }
    getAuthStateListener(){
        return this.authStateListener.asObservable();
    }
    createrUser(email: String, password: String){
        const authData: AuthData= {email: email, password: password}; 
        this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(res=>
                console.log(res)
            )
    }
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
      }
    login(email: String, password: String){
        const authData: AuthData= {email: email, password: password}; 
        this.http.post<{token:string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(res=>{
                const token=res.token;
                this.token=token;
                if (token) {
                    this.isAuthenticated = true;
                    this.authStateListener.next(true);
                  }
            }
            )
    }
}