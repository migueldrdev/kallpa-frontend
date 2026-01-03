import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '@services/api-config.service';

// Definimos la interfaz exacta de lo que espera Java
export interface CreateOrderDto {
  customerName: string;
  email: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  private apiUrl = this.apiConfig.endpoints.orders;

  createOrder(order: CreateOrderDto): Observable<{ orderId: string, message: string }> {
    return this.http.post<{ orderId: string, message: string }>(this.apiUrl, order);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
  }
}
