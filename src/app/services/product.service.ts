import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Inyección de dependencias moderna (sin constructor)
  private http = inject(HttpClient);

  // ⚠️ Asegúrate que este puerto es el de tu Backend (8081)
  private apiUrl = 'http://localhost:8081/api/v1/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}
