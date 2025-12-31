import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true; // Pasa, amigo
  }

  // ¡ALTO! No estás logueado.
  toastService.info('Debes iniciar sesión para continuar');

  // Te mandamos al login, pero recordamos a dónde querías ir (returnUrl)
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
