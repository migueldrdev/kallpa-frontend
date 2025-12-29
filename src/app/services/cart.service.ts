import { Injectable, computed, signal, Signal } from '@angular/core';
import { CartItem } from '@models/cart-item';
import { Product } from '@models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Estado del carrito usando señales
  private cartItems = signal<CartItem[]>([]);

  // Propiedades computadas
  totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  // ✅ MEJOR VERSIÓN: Inmutable + cantidad configurable
  addToCart(product: Product, quantity: number = 1): void {
    this.cartItems.update((currentItems: CartItem[]) => {
      const existingIndex = currentItems.findIndex(
        (item: CartItem) => item.product.id === product.id
      );

      if (existingIndex !== -1) {
        // Producto existe: crear nuevo array actualizando la cantidad
        return currentItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Producto nuevo: crear nuevo array agregándolo
        return [...currentItems, { product, quantity }];
      }
    });

    this.openCart();
  }

  // ✅ Actualizar cantidad directamente (útil para input numérico en el carrito)
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update((currentItems: CartItem[]) =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  // ✅ Remover del carrito
  removeFromCart(productId: string): void {
    this.cartItems.update(items =>
      items.filter((item: CartItem) => item.product.id !== productId)
    );
  }

  // ✅ Limpiar carrito
  clearCart(): void {
    this.cartItems.set([]);
  }

  // ✅ Obtener items (readonly)
  getCartItems(): Signal<CartItem[]> {
    return this.cartItems.asReadonly();
  }

  // ✅ Estado de visibilidad del carrito
  isOpen = signal<boolean>(false);

  toggleCart(): void {
    this.isOpen.update(open => !open);
  }

  closeCart(): void {
    this.isOpen.set(false);
  }

  openCart(): void {
    this.isOpen.set(true);
  }



}
