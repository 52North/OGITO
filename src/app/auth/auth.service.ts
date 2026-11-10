import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AppconfigService } from '../config/appconfig.service';
import { ApplicationConfiguration } from '../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // default claim key for roles, used when `auth.rolesClaim` is not configured
  private static readonly DEFAULT_ROLES_CLAIM = 'https://ogito.app/roles';

  private userProfileSubject$: BehaviorSubject<any>;
  public userProfile$: Observable<any>;
  public allowAnonLogin: boolean = false;

  // Create a local property for login status
  private loggedIn: boolean = null;

  constructor(private router: Router, private config: AppconfigService, private oauthService: OAuthService) {
    this.config.getAppConfigPromise().then((config: ApplicationConfiguration) =>{
      this.allowAnonLogin = !config.requireAuth;
      if(!this.allowAnonLogin){
        const authConfig: AuthConfig = {
          issuer: config.auth.issuer,
          clientId: config.auth.clientId,
          redirectUri: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
          responseType: 'code',
          scope: 'openid profile email',
          customQueryParams: config.auth.customQueryParams,
        };
        this.oauthService.configure(authConfig);

        this.userProfileSubject$ = new BehaviorSubject<any>(null);
        this.userProfile$ = this.userProfileSubject$.asObservable();

        // Keep login status and user profile in sync with token lifecycle events
        this.oauthService.events.subscribe(event => {
          if (event.type === 'token_received' || event.type === 'token_refreshed') {
            this.updateUserState();
          }
          if (event.type === 'logout') {
            this.loggedIn = false;
            this.userProfileSubject$.next(null);
          }
        });

        // Loads the discovery document, and - if the browser just came back from the
        // IDP's login page with an authorization code - completes the login automatically
        this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
          this.updateUserState();
          this.oauthService.setupAutomaticSilentRefresh();
          // if a redirect happened just now, `state` holds the redirectPath passed to login().
          // angular-oauth2-oidc encodes the custom state twice when building the login URL
          // (once for the value itself, once for the nonce+state composite) but only decodes
          // once on the way back, so one layer of percent-encoding remains here - decode it,
          // otherwise router.navigate() would percent-encode it again (e.g. '/' -> '%2F' -> '%252F').
          if (this.oauthService.state) {
            const redirectPath = decodeURIComponent(this.oauthService.state);
            this.router.navigate([redirectPath]);
          }
        });
      } //end if anon login
    })

  }

  private updateUserState(): void {
    this.loggedIn = this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
    if (this.loggedIn) {
      this.userProfileSubject$.next(this.oauthService.getIdentityClaims());
    }
  }

  public isLoggedIn() : boolean {
      return this.loggedIn;
  }

  public getUserRoles(): string[] {
    if (this.allowAnonLogin) {
      return [];
    }
    const claims = this.userProfileSubject$?.value;
    const rolesClaimPath = this.config.getAppConfig()?.auth?.rolesClaim ?? AuthService.DEFAULT_ROLES_CLAIM;
    const roles = this.resolveClaim(claims, rolesClaimPath);
    return Array.isArray(roles) ? roles : [];
  }

  public isAdmin(): boolean {
    const adminRole = this.config.getAppConfig()?.auth?.adminRole;
    return !!adminRole && this.getUserRoles().includes(adminRole);
  }

  /**
   * Resolves a configured claim key/path against the decoded ID token claims.
   * Tries the whole path as a flat key first - this correctly handles Auth0-style
   * namespaced custom claims (e.g. "https://ogito.app/roles") which contain literal
   * dots but are not a nested path. Only if that misses and the path contains a dot,
   * falls back to splitting on '.' and traversing nested objects - this handles
   * Keycloak-style paths (e.g. "realm_access.roles").
   */
  private resolveClaim(claims: Record<string, any> | null | undefined, path: string): any {
    if (!claims || !path) {
      return undefined;
    }
    if (Object.prototype.hasOwnProperty.call(claims, path)) {
      return claims[path];
    }
    if (path.includes('.')) {
      return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), claims);
    }
    return undefined;
  }

  public async getAccessToken(): Promise<string | undefined> {
    await this.config.getAppConfigPromise();
    if (this.allowAnonLogin) {
      return undefined;
    }
    const token = this.oauthService.getAccessToken();
    return token || undefined;
  }

  login(redirectPath: string = '/') {
    if(!this.allowAnonLogin){
      // Redirects to the IDP's login page; redirectPath is restored from `oauthService.state` after the redirect back
      this.oauthService.initCodeFlow(redirectPath);
    }else{
      this.loggedIn = true;
      this.userProfile$ = of({
        nickname: "anonymous user"
      })
    }
  }

  logout() {
    if(!this.allowAnonLogin){
      // Standards-based RP-Initiated Logout via the IDP's discovery document
      this.oauthService.logOut();
   }else{
    this.loggedIn = false;
    window.location.href = `${window.location.origin}`;
   }
  }

}
