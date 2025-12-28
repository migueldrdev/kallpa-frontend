import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  // --- INPUTS (Datos que recibe) ---
  // Usamos la nueva sintaxis input() de Angular 17+
  currentPage = input.required<number>(); // Página actual (0, 1, 2...)
  totalPages = input.required<number>();  // Total de páginas
  isFirst = input<boolean>(false);        // ¿Es la primera?
  isLast = input<boolean>(false);         // ¿Es la última?

  // --- OUTPUTS (Eventos que emite) ---
  // Avisamos al padre que cambie de página
  pageChange = output<number>();

  // Métodos auxiliares para la vista
  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  // Genera un array [0, 1, 2...] para pintar los numeritos (Opcional, pero pro)
  get pagesArray(): number[] {
    // Retorna un array con los números de página
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}
