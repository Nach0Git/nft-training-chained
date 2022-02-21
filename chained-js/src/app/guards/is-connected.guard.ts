import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DAppService } from '../services/d-app.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IsConnectedGuard implements CanActivate, CanLoad {
  constructor(private readonly _dAppService: DAppService, private readonly _router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this._dAppService.isConnected$.pipe(
      map((connected) => {
        if (!connected) this._router.navigateByUrl('/').then();
        return connected;
      })
    );
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this._dAppService.isConnected$.pipe(
      map((connected) => {
        if (!connected) this._router.navigateByUrl('/').then();
        return connected;
      })
    );
  }
}
