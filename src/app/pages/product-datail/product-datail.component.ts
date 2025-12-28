import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para leer la URL
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-datail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-datail.component.html',
  styleUrl: './product-datail.component.css'
})
export class ProductDatailComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product: Product | null = null;
  loading = true;

  ngOnInit(): void {
    // Leemos el parámetro ':slug' de la ruta
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
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
}
