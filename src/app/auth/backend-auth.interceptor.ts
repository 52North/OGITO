import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AppconfigService } from '../config/appconfig.service';
import { OpenLayersService } from '../open-layers.service';

/**
 * Interceptor that attaches the access token every requests made through Angular's HttpClient to the backend (QGIS server, geocoder, etc.) if the request URL matches the configured backend URLs.
 */
@Injectable()
export class BackendAuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private config: AppconfigService,
    private openLayersService: OpenLayersService,
  ) {}

  /**
   * Intercepts outgoing HTTP requests and attaches the access token to the Authorization header if the request URL matches the configured backend URLs.
   * QGIS server and geocoder are considered protected backend URLs by default.
   * additional protected backend URLs can be configured in the app config file (/src/assets/configuration/appsettings.json) under the key "protectedBackendUrls".
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // own backends only - never attach the token to a third-party URL (e.g. a external public geocoder) unless it is explicitly configured in the appsettings.json"
    const protectedBaseUrls = [
      this.config.getAppConfig()?.qgisServerUrl,
      this.openLayersService.getCurrentProjectConfiguration()?.geocoder?.baseUrl,
      ...(this.config.getAppConfig()?.protectedBackendUrls ?? []),
    ].filter((url): url is string => !!url);

    if (!protectedBaseUrls.some(baseUrl => req.url.startsWith(baseUrl))) {
      return next.handle(req);
    }
    return from(this.auth.getAccessToken()).pipe(
      switchMap(token => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;
        return next.handle(authReq);
      })
    );
  }
}
