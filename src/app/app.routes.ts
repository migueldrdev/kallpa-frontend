import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDatailComponent } from './pages/product-datail/product-datail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'p/:slug', component: ProductDatailComponent },
  { path: '**', redirectTo: '' }

];
