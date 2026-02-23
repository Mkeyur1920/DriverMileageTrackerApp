import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../../pages/service/login.service';

function isAuthenticated(
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): boolean {
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.isAuthenticated) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
}

export const authGuard: CanActivateFn = isAuthenticated;
export const authChildGuard: CanActivateChildFn = isAuthenticated;
