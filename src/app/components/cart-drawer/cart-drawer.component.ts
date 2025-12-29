import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-drawer',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.css'
})
export class CartDrawerComponent {
  cartService = inject(CartService);
}
