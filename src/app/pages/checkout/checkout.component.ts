import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService, CreateOrderDto } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule], // ¡Importante importar ReactiveFormsModule!
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  // Exponemos el carrito para mostrar el resumen y total
  cartItems = this.cartService.getCartItems();
  totalPrice = this.cartService.totalPrice;

  // Definimos el formulario con validaciones
  checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    // Podrías agregar tarjeta aquí luego
  });

  isSubmitting = false;

  onSubmit() {
    if (this.checkoutForm.invalid || this.cartItems().length === 0) return;

    this.isSubmitting = true;

    // 1. Preparamos el objeto para el Backend
    const orderData: CreateOrderDto = {
      customerName: this.checkoutForm.value.name!,
      email: this.checkoutForm.value.email!,
      items: this.cartItems().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    // 2. Enviamos al Backend
    this.orderService.createOrder(orderData).subscribe({
      next: (res) => {
        console.log('Orden creada:', res.orderId);
        this.cartService.clearCart(); // ¡Limpiamos el carrito!
        this.router.navigate(['/']); // Redirigimos al Home (o a una página de éxito)
        alert(`¡Gracias por tu compra! Orden #${res.orderId}`);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Hubo un error procesando tu pedido. Revisa el stock.');
      }
    });
  }
}
