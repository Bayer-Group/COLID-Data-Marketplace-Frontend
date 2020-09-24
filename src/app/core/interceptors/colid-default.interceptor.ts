import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GeneralException } from '../../shared/models/exceptions/general-exception';
import { ColidMatSnackBarService } from '../../modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { BusinessException } from '../../shared/models/exceptions/business-exception';
import { TechnicalException } from '../../shared/models/exceptions/technical-exception';
import { EntityNotFoundException } from '../../shared/models/exceptions/business/entity-not-found-exception';
import { environment } from 'src/environments/environment';

@Injectable()
export class ColidDefaultInterceptor implements HttpInterceptor {

  constructor(public router: Router, private snackBar: ColidMatSnackBarService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });

    return next.handle(request)
      .pipe(
        tap(event => { },
          error => {
            if (error instanceof HttpErrorResponse) {

              // Needed to ignore first user not found exception so that i can be created by the client first
              if (error.status === 404 && request.url.startsWith(`${environment.appDataApiUrl}/Users/`)) {
                return;
              }

              if (error.error as GeneralException) {
                this.handleException(error.error);
                return of(error);
              }
            }
            return of(error);
          })
      );
  }

  private handleException(colidException: GeneralException) {
    const statusCode = +colidException.code;
    // Client errors
    if (statusCode >= 400 && statusCode < 500) {
      this.handleClientException(colidException);
    }
    // Server errors
    else if (statusCode >= 500) {
      this.handleServerException(colidException)
    }
  }

  private handleClientException(exception: BusinessException) {
    switch (exception.type) {
      case BusinessException.name:
        this.snackBar.error("Error", exception.message, exception);
        break;
      case EntityNotFoundException.name:
        this.snackBar.error("Not found", exception.message, exception);
        break;
      default:
        this.snackBar.error("Error", exception.message, exception);
    }
  }

  private handleServerException(exception: BusinessException) {
    switch (exception.type) {
      case TechnicalException.name:
        this.snackBar.error("Technical Error", exception.message, exception);
        break;
      default:
        this.snackBar.error("Error", exception.message, exception);
    }
  }
}
