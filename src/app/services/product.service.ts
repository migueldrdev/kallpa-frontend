import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '@models/page';
import { Product } from '@models/product';
import { ApiConfigService } from '@services/api-config.service';

interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
}

interface ProductSearchParams extends PageableParams {
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  // Inyección de dependencias moderna (sin constructor)
  private http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  private apiUrl = this.apiConfig.endpoints.products;

  /**
   * Construye HttpParams de forma segura y legible
   */
  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.append(key, value.toString());
      }
    });

    return httpParams;
  }

  getProducts(params: PageableParams = {page: 0, size: 10, sort: 'name'}): Observable<Page<Product>> {
    const httpParams = this.buildParams(params);
    return this.http.get<Page<Product>>(this.apiUrl, { params: httpParams});
  }

  getProductBySlug(slug: string): Observable<Product> {
    const url = `${this.apiUrl}/${slug}`;
    return this.http.get<Product>(url);
  }

  searchProductsByName(searchParams: ProductSearchParams): Observable<Page<Product>> {
    const params = {
      ...searchParams,
      page: searchParams.page ?? 0,
      size: searchParams.size ?? 10,
      sort: searchParams.sort ?? 'name'
    };
    const httpParams = this.buildParams(params);
    return this.http.get<Page<Product>>(`${this.apiUrl}/search`, { params: httpParams });
  }
}
