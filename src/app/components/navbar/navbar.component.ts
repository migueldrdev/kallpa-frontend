import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '@services/cart.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
