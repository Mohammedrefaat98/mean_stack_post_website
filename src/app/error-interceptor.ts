import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor{
    constructor(private dialog: MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage= "An unknown error occured"
                if(error.error){
                    errorMessage=error.error.message;
                }
                console.log(error)
                this.dialog.open(ErrorComponent, {data:{message: errorMessage}})
                return throwError(()=> error);
            })
        )
    }
     
}