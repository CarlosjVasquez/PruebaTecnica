import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../../models/product';
import { ButtonComponent } from '../button/button.component';
import { ProductService } from '../../services/product.service';

interface ErrorVerificationId {
  customError: {
    message: string;
  };
}

@Component({
  selector: 'form-product',
  standalone: true,
  imports: [InputComponent, FormsModule, ButtonComponent],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent {
  @Input() edit: boolean = false;
  @Input() product: Product = new Product('', '', '', '', '', '');
  @Output() submitEventEmitter: EventEmitter<Product> = new EventEmitter();

  errorVerificationId: ErrorVerificationId | null = null;

  constructor(private productService: ProductService) {}

  onSubmit() {
    this.submitEventEmitter.emit(this.product);
  }

  getSearchErrors(form: NgForm) {
    const searchControl = form.controls['search'];
    return searchControl ? searchControl.errors : null;
  }

  currentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  calcdate_revision(): void {
    const date_release = new Date(this.product.date_release);
    date_release.setFullYear(date_release.getFullYear() + 1);
    this.product.date_revision = date_release.toISOString().split('T')[0];
  }

  verificationID(id: string) {
    this.productService.verificationID(id).subscribe((data) => {
      if (data) {
        this.errorVerificationId = {
          customError: {
            message: 'ID no válido!',
          },
        };
        return;
      }
      this.errorVerificationId = null;
    });
  }
}
