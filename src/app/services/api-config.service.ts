import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly baseUrl: string = environment.apiUrl;

  readonly endpoints = {
    products: `${this.baseUrl}/products`,
    categories: `${this.baseUrl}/categories`,
    cart: `${this.baseUrl}/cart`,
    orders: `${this.baseUrl}/orders`,
    auth: `${this.baseUrl}/auth`,
    users: `${this.baseUrl}/users`
  } as const;

  readonly timeout: number = environment.apiTimeout;
  readonly isProduction: boolean = environment.production;
  readonly enableDebugLog: boolean = environment.enableDebugLog;
}
