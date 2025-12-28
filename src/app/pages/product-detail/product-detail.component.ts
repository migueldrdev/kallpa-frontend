import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Para leer la URL y navegar
import { CommonModule } from '@angular/common';
import { ProductService } from '@services/product.service';
import { Product } from '@models/product';
import { CartService } from '@app/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  quantity = signal<number>(1);
  loading = true;

  goToHome(): void {
    this.router.navigate(['/']);
  }

  private loadProduct(slug: string) {
    this.productService.getProductBySlug(slug).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  changeQuantity(increment: boolean): void {
    if (increment) {
      this.quantity.update(qty => qty + 1);
    } else {
      this.quantity.update(qty => Math.max(1, qty - 1));
    }
  }

  onQuantityInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value >= 1) {
      this.quantity.set(value);
    } else {
      this.quantity.set(1);
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity());
    }
  }

  // Inicialización del componente
  ngOnInit(): void {
    // Leemos el parámetro ':slug' de la ruta
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }
}
