import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

// Tipos para las respuestas y payloads
interface LoginResponse {
  token: string;
}

interface AuthUser {
  sub: string; // Email (según estándar JWT)
  userId: string;
  role: string;
  name: string;
  exp: number; // Expiración
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'kallpa_token';

  // --- ESTADO REACTIVO (Signals) ---
  // null = No logueado, AuthUser = Logueado
  currentUser = signal<AuthUser | null>(null);

  // Computed: Para saber fácil si está logueado
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    // Al iniciar la app, intentamos recuperar la sesión si existe token guardado
    this.loadSession();
  }

  // --- ACCIONES ---

  login(credentials: {email: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.saveSession(response.token))
      );
  }

  register(data: {fullName: string, email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // --- LÓGICA DE SESIÓN ---

  private saveSession(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.decodeAndSetUser(token);
  }

  private loadSession() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout();
      } else {
        this.decodeAndSetUser(token);
      }
    }
  }

  private decodeAndSetUser(token: string) {
    try {
      const decoded = jwtDecode<AuthUser>(token);
      this.currentUser.set(decoded);
    } catch (error) {
      console.error('Error decodificando token', error);
      this.logout();
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<AuthUser>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Método helper para obtener el token "en crudo" (lo usaremos en el Interceptor)
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
