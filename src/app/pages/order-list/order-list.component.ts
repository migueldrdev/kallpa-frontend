import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para pipes como DatePipe y CurrencyPipe
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importamos RouterLink para el botón "Ir a comprar"
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  private orderService = inject(OrderService);

  // Mágia de Angular 17+: Convertimos el Observable HTTP en una Signal de lectura
  // initialValue: [] evita errores mientras carga los datos del backend
  orders = toSignal(this.orderService.getMyOrders(), { initialValue: [] });
}
