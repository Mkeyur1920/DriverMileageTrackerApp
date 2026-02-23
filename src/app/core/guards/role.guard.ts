import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../../pages/service/login.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
): boolean => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const allowedRoles = (route.data?.['roles'] as string[] | undefined) ?? [];

  if (!loginService.isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => loginService.hasRole(role))
  ) {
    return true;
  }

  router.navigate(['/auth/access']);
  return false;
};
