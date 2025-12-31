import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { ProductDetailComponent } from '@pages/product-detail/product-detail.component';
import { CheckoutComponent } from '@pages/checkout/checkout.component';
import { LoginComponent } from '@pages/login/login.component';
import { RegisterComponent } from '@pages/register/register.component';
import { authGuard } from '@guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'p/:slug', component: ProductDetailComponent },
  {
    path: 'checkout/express',
    component: CheckoutComponent,
    canActivate: [authGuard], // <--- ¡Candado puesto!
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' },
];
