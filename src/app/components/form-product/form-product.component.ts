import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
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
  imports: [InputComponent, FormsModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent implements OnInit {
  @Input() edit: boolean = false;
  @Output() submitEventEmitter: EventEmitter<Product> = new EventEmitter();

  errorVerificationId: ErrorVerificationId | null = null;
  form!: FormGroup;

  constructor(
    private readonly productService: ProductService,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._fb.group({
      id: new FormControl(''),
      name: new FormControl(''),
      description: new FormControl(''),
      logo: new FormControl(''),
      date_release: new FormControl(''),
      date_revision: new FormControl(''),
    });
  }

  onSubmit() {
    this.submitEventEmitter.emit(this.form.value);
  }

  getSearchErrors(form: NgForm) {
    const searchControl = form.controls['search'];
    return searchControl ? searchControl.errors : null;
  }

  currentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  calcdate_revision(): void {
    const date_release = new Date(this.form.value.date_release);
    date_release.setFullYear(date_release.getFullYear() + 1);
    this.form.patchValue({
      date_revision: date_release.toISOString().split('T')[0],
    });
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

  formControlType(key: string) {
    return this.form.controls[key] as FormControl;
  }
}
