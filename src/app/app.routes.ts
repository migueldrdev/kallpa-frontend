import { Routes } from '@angular/router';
import { HomeComponent } from '@pages/home/home.component';
import { ProductDetailComponent } from '@pages/product-detail/product-detail.component';
import { CheckoutComponent } from '@pages/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'p/:slug', component: ProductDetailComponent },
  { path: 'checkout/express', component: CheckoutComponent },
  { path: '**', redirectTo: '' }

];
