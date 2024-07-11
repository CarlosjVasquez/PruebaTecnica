import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormProductComponent } from '../form-product/form-product.component';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormProductComponent, ButtonComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, OnDestroy {
  private subscriptionSelectedProduct: Subscription;
  selectedProduct: Product = new Product('', '', '', '', '', '');
  title: string = 'Formulario de Registro';
  edit: boolean = false;

  constructor(private router: Router, private productService: ProductService) {
    this.subscriptionSelectedProduct =
      this.productService.selectedProduct$.subscribe((value) => {
        this.selectedProduct = value;
      });

    if (this.router.url === '/product/update') this.edit = true;
  }

  ngOnInit(): void {
    if (this.edit) {
      if (!this.selectedProduct.id) {
        this.router.navigate(['/products']);
      }
      this.title = 'Actualizar Producto';
    }
  }

  clearSelectProduct() {
    this.productService.selectProduct(new Product('', '', '', '', '', ''));
    this.router.navigate(['/products']);
  }

  onSubmitForm(product: Product) {
    this.edit
      ? this.productService.updateProduct(product)
      : this.productService.addProduct(product);
    this.clearSelectProduct();
  }

  ngOnDestroy(): void {
    this.subscriptionSelectedProduct.unsubscribe();
  }
}
