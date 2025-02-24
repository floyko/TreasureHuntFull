import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService  {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token;
    if(typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if(token) {
      const clonedRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token)
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
