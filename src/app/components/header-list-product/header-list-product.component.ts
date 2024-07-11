import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'header-list-product',
  standalone: true,
  imports: [ButtonComponent, SearchComponent],
  templateUrl: './header-list-product.component.html',
  styleUrl: './header-list-product.component.scss',
})
export class HeaderListProductComponent {
  @Output() onInputEventemitter: EventEmitter<string> = new EventEmitter();
  constructor(private router: Router) {}

  onAddProduct() {
    this.router.navigate(['/product/create']);
  }

  onHandleSubmit(search: string) {
    this.onInputEventemitter.emit(search);
  }
}
