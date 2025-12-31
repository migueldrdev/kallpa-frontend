import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@services/cart.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  authService = inject(AuthService); // Inyectamos Auth
  router = inject(Router);

  goToCheckout() {
    this.cartService.closeCart(); // Cerramos el drawer primero

    if (this.authService.isAuthenticated()) {
      // Si está logueado, directo a pagar
      this.router.navigate(['/checkout']);
    } else {
      // Si no, lo mandamos al login con retorno al checkout
      // El Guard haría esto también, pero hacerlo manual aquí es mejor UX
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
    }
  }
}
