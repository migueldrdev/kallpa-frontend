import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para pipes como 'currency'
import { ProductService } from '../../services/product.service';
import { Page } from '../../models/page';
import { Product } from '../../models/product';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent],
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
  isFirst: boolean = true;
  isLast: boolean = false;

  loadAllProducts() {
    this.isLoading = true;
    this.hasConnectionError = false;
    this.isSearching = false;
    this.searchQuery = '';

    this.productService.getProducts({ page: this.currentPage, size: 2, sort: 'name,asc' }).subscribe({
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
      this.productService.searchProductsByName({ name, page: this.currentPage, size: 2, sort: 'name,asc' }).subscribe({
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

  // Método unificado que recibirá el evento del hijo
  onPageChange(newPage: number) {
    console.log("NewPage ->", newPage);

    this.currentPage = newPage;

    if(this.isSearching && this.searchQuery.length > 2) {
      // Si está buscando, hacer búsqueda con la nueva página
      this.productService.searchProductsByName({
        name: this.searchQuery,
        page: newPage,
        size: 1,
        sort: 'name,asc'
      }).subscribe({
        next: (page: Page<Product>) => {
          this.products = page.content;
          this.totalPages = page.totalPages;
          this.currentPage = page.number;
          this.isFirst = page.first;
          this.isLast = page.last;
        }
      });
    } else {
      // Si no está buscando, cargar todos los productos
      this.loadAllProducts();
    }

    // Scroll suave hacia arriba al cambiar página (Toque de UX fino)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Se llama automáticamente al iniciar el componente
  ngOnInit(): void {
    this.loadAllProducts();
  }
}
