import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para pipes como 'currency'
import { ProductService } from '../../services/product.service';
import { Page } from '../../models/page';
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
  isLoading: boolean = true;
  hasConnectionError: boolean = false;
  isSearching: boolean = false;
  searchQuery: string = '';

  // 🔥 Información adicional de paginación (opcional pero útil)
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;

  loadAllProducts() {
    this.isLoading = true;
    this.hasConnectionError = false;
    this.isSearching = false;
    this.searchQuery = '';

    this.productService.getProducts({ page: 0, size: 20, sort: 'name,asc' }).subscribe({
      next: (page: Page<Product>) => {
        this.products = page.content;
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.currentPage = page.number;
        this.isLoading = false;

        console.log('Productos cargados:', page);
      },
      error: (err) => {
        console.error('Error conectando al backend:', err);
        this.hasConnectionError = true;
        this.isLoading = false;
      }
    });
  }

  searchProduct(event: Event) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const name: string = input.value.trim();
    this.searchQuery = name;

    if (name.length > 2) {
      this.isSearching = true;
      this.isLoading = true;
      // Llamar al servicio de búsqueda
      this.productService.searchProductsByName({ name, page: 0, size: 20, sort: 'name,asc' }).subscribe({
        next: (page: Page<Product>) => {
          this.products = page.content;
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error en búsqueda:', err);
          this.products = [];
          this.isLoading = false;
        }
      });
    } else if (name.length === 0) {
      // Si borra todo, volver a cargar todos
      this.loadAllProducts();
    }
  }

  // Se llama automáticamente al iniciar el componente
  ngOnInit(): void {
    this.loadAllProducts();
  }
}
