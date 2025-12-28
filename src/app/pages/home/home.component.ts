import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para pipes como 'currency'
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink], // 👈 Importante importar esto
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        console.log('Productos cargados:', data);
      },
      error: (err) => console.error('Error conectando al backend:', err)
    });
  }
}
