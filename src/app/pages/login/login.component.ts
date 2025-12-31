import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Para leer params
  private toastService = inject(ToastService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isSubmitting = false;

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.toastService.success('¡Bienvenido de nuevo!');

        // --- LOGICA DE REDIRECCIÓN ---
        // Buscamos si hay una URL de retorno en los parámetros (ej: ?returnUrl=/checkout)
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isSubmitting = false;
        // Manejamos el error 401 que configuramos en el Backend
        // obtener la primera key del objeto fieldErrors para mostrar el mensaje adecuado
        console.log("Error ->", err);

        const firstFieldErrorKey = err?.error?.fieldErrors ? Object.keys(err.error.fieldErrors)[0] : null;
        if (firstFieldErrorKey) {
          this.toastService.error(err.error.fieldErrors[firstFieldErrorKey]);
        } else if (err.status === 401) {
          this.toastService.error(err.error.description || 'Credenciales inválidas');
        } else {
          this.toastService.error('Error de conexión con el servidor');
        }
      },
    });
  }
}
