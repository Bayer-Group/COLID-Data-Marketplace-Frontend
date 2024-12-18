import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
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
  constructor(
    public router: Router,
    private snackBar: ColidMatSnackBarService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /*
     * For most requests, the content type must be set to application/json.
     *
     * Exceptions:
     *  - When uploading files, the content type must not be set at all,
     *    so that the browser can choose the correct content type depending on the file type.
     *    To indicate that the content type should not be set, the x-skip-content-type header is used as a flag.
     */
    if (!request.headers.has('x-skip-content-type')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    /*
     * For most requests, the cache control must be set to no-cache.
     */
    request = request.clone({
      setHeaders: {
        'Cache-Control': 'no-cache'
      }
    });

    return next.handle(request).pipe(
      tap(
        (_) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (this.isToBeIgnoredResponse(error.status, request.url)) {
              return of(error);
            }

            if (error.error as GeneralException) {
              this.handleException(error.error);
              return of(error);
            }
          }
          return of(error);
        }
      )
    );
  }

  private isToBeIgnoredResponse(errorStatus: number, url: string) {
    return (
      (errorStatus == 404 &&
        url.startsWith(`${environment.colidApiUrl}/graph/graphType`)) ||
      (errorStatus === 404 &&
        url.startsWith(`${environment.appDataApiUrl}/Users/`))
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
      this.handleServerException(colidException);
    }
  }

  private handleClientException(exception: BusinessException) {
    switch (exception.type) {
      case BusinessException.name:
        this.snackBar.error('Error', exception.message, exception);
        break;
      case EntityNotFoundException.name:
        this.snackBar.error('Not found', exception.message, exception);
        break;
      default:
        this.snackBar.error('Error', exception.message, exception);
    }
  }

  private handleServerException(exception: BusinessException) {
    switch (exception.type) {
      case TechnicalException.name:
        this.snackBar.error('Technical Error', exception.message, exception);
        break;
      default:
        this.snackBar.error('Error', exception.message, exception);
    }
  }
}
