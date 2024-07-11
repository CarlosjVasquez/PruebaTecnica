import { Routes } from '@angular/router';
import { ListProductComponent } from './components/list-product/list-product.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/products' },
  {
    path: 'products',
    component: ListProductComponent,
  },
  {
    path: 'product',
    children: [
      {
        path: 'create',
        component: ProductComponent,
      },
      {
        path: 'update',
        component: ProductComponent,
      },
    ],
  },
];
