import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {finalize, Observable} from "rxjs";
import {SpinnerService} from "./spinner.service";

@Injectable({providedIn:'root'})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    );
  }
}
