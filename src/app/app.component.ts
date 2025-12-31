import { Component, inject} from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { CartDrawerComponent } from '@components/cart-drawer/cart-drawer.component';
import { ToastComponent } from '@components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CartDrawerComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);

  // Señal o variable simple para saber si mostramos el layout completo
  showLayout = true;

  constructor() {
    // Escuchamos cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      // Ocultamos navbar/footer en login y register
      console.log('cambio de ruta', url);

      const isAuthPage = url.includes('/login') || url.includes('/register');
      this.showLayout = !isAuthPage;
      console.log(this.showLayout);

    });
  }
}


