import { Injectable } from '@angular/core';
import {createAuth0Client} from '@auth0/auth0-spa-js';
import {Auth0Client} from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppconfigService } from './config/appconfig.service';
import { ApplicationConfiguration } from './config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create an observable of Auth0 instance of client
  private auth0Client$;
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  private isAuthenticated$;
  private handleRedirectCallback$;
  private userProfileSubject$;
  public userProfile$;
  public allowAnonLogin: boolean = false;

  // Create subject and public observable of user profile data
  // Create a local property for login status
  private loggedIn: boolean = null;

  constructor(private router: Router, private config: AppconfigService) {
    this.config.getAppConfigPromise().then((config: ApplicationConfiguration) =>{
      this.allowAnonLogin = !config.requireAuth;
      if(!this.allowAnonLogin){
        this.auth0Client$ = (from(
          createAuth0Client({
            domain: config.auth.domain,
            clientId: config.auth.clientId,
            authorizationParams: {
              redirect_uri: `${window.location.origin}`
            }
          })
        ) as Observable<Auth0Client>).pipe(
          shareReplay(1), // Every subscription receives the same shared value
          catchError(err => throwError(err))
        );

        this.isAuthenticated$ = this.auth0Client$.pipe(
          concatMap((client: Auth0Client) => from(client.isAuthenticated())),
          tap((res: boolean) => this.loggedIn = res)
        );

        this.handleRedirectCallback$ = this.auth0Client$.pipe(
          concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
        );

        this.auth0Client$.pipe(
          concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
        );


        this.userProfileSubject$ = new BehaviorSubject<any>(null);
        this.userProfile$ = this.userProfileSubject$.asObservable();

        // On initial load, check authentication state with authorization server
        // Set up local auth streams if user is already authenticated
        this.localAuthSetup();
        // Handle redirect from Auth0 login
        this.handleAuthCallback();
      } //end if anon login
    })

  }

  public isLoggedIn() : boolean {
      return this.loggedIn;
  }


  private getUser$(): Observable<any> {
    if(!this.allowAnonLogin){
      return this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.getUser())),
        tap(user => this.userProfileSubject$.next(user))
      );
    }
  }

  private localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, get user and set in app
          // NOTE: you could pass options here if needed
          return this.getUser$();
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    checkAuth$.subscribe();
  }

  login(redirectPath: string = '/') {
    if(!this.allowAnonLogin){
      if(this.auth0Client$){
        // A desired redirect path can be passed to login method
        // (e.g., from a route guard)
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
          // Call method to log in
          client.loginWithRedirect({
            authorizationParams:{
              redirect_uri: `${window.location.origin}`
            },
            appState: { target: redirectPath }
          });
        });
      }
    }else{
      this.loggedIn = true;
      this.userProfile$ = of({
        nickname: "anonymous user"
      })
    }
  }

  private handleAuthCallback() {
    // Call when app reloads after user logs in with Auth0
    const params = window.location.search;
    if (params.includes('code=') && params.includes('state=')) {
      let targetRoute: string; // Path to redirect to after login processsed
      const authComplete$ = this.handleRedirectCallback$.pipe(
        // Have client, now call method to handle auth callback redirect
        tap((cbRes : any) => {
          // Get and set target redirect route from callback results
          targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
        }),
        concatMap(() => {
          // Redirect callback complete; get user and login status
          return combineLatest([
            this.getUser$(),
            this.isAuthenticated$
          ]);
        })
      );
      // Subscribe to authentication completion observable
      // Response will be an array of user and login status
      authComplete$.subscribe(([user, loggedIn]) => {
        // Redirect to target route after callback processing
        this.router.navigate([targetRoute]);
      });
    }
  }

  logout() {
    if(!this.allowAnonLogin){
      if(this.auth0Client$){
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
          // Call method to log out
          client.logout({
            clientId: this.config.getAppConfig().auth.clientId,
            logoutParams: {
              returnTo: `${window.location.origin}`
            }
          });
        });
      }
   }else{
    this.loggedIn = false;
    window.location.href = `${window.location.origin}`;
   }
  }

}
