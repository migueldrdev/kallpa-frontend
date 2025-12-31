
import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '@models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Estado reactivo: Lista de notificaciones visibles
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = crypto.randomUUID(); // Genera ID único

    const newToast: Toast = { id, message, type, duration };

    // Agregamos al array (update)
    this.toasts.update(current => [...current, newToast]);

    // Auto-eliminación después del tiempo
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  // Helpers rápidos
  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error', 4000); }
  info(msg: string) { this.show(msg, 'info'); }
}
