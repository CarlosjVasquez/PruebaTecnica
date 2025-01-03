import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductComponent } from './form-product.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ButtonComponent } from '../../../../components/button/button.component';
import { InputComponent } from '../../../../components/input/input.component';
import { FormsModule, NgForm } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;
  let compiled: HTMLElement;
  let productService: ProductService;

  interface MockFormControls {
    [key: string]: any;
  }

  beforeEach(async () => {
    const productServiceMock = {
      verificationID: jest.fn().mockReturnValue(of(false)),
    };

    await TestBed.configureTestingModule({
      providers: [
        FormsModule,
        FormProductComponent,
        InputComponent,
        ButtonComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
    component.product = new Product(
      '1',
      'Product 1',
      'Description',
      'logo.png',
      '2023-01-01',
      '2024-01-01'
    );
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('match to snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });

  test('should button', () => {
    const button = fixture.debugElement.query(By.directive(ButtonComponent));
    expect(button).toBeTruthy();
  });

  test('should input', () => {
    const input = fixture.debugElement.query(By.directive(InputComponent));
    expect(input).toBeTruthy();
  });

  test('should emit submit event with product data on submit', () => {
    jest.spyOn(component.submitEventEmitter, 'emit');
    component.onSubmit();
    expect(component.submitEventEmitter.emit).toHaveBeenCalledWith(
      component.product
    );
  });

  test('should return search control errors from the form', () => {
    const mockForm = {
      controls: {
        search: {
          errors: { required: true },
        },
      },
    } as unknown as NgForm & MockFormControls;
    const errors = component.getSearchErrors(mockForm as NgForm);
    expect(errors).toEqual({ required: true });
  });

  test('should return null if search control is not present in the form', () => {
    const mockForm = {
      controls: {},
    } as unknown as NgForm & MockFormControls;
    const errors = component.getSearchErrors(mockForm as NgForm);
    expect(errors).toBeNull();
  });

  test('should return the current date in YYYY-MM-DD format', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    expect(component.currentDate()).toEqual(currentDate);
  });

  test('should calculate date_revision as one year after date_release', () => {
    component.product.date_release = '2023-01-01';
    component.calcdate_revision();
    expect(component.product.date_revision).toBe('2024-01-01');
  });

  test('should set errorVerificationId if verificationID returns true', () => {
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(true));
    component.verificationID('test-id');
    fixture.detectChanges();
    expect(component.errorVerificationId).toEqual({
      customError: { message: 'ID no válido!' },
    });
  });

  test('should set errorVerificationId to null if verificationID returns false', () => {
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(false));
    component.verificationID('test-id');
    fixture.detectChanges();
    expect(component.errorVerificationId).toBeNull();
  });

  test('should call verificationID method of ProductService', () => {
    const productId = 'test-id';
    jest.spyOn(productService, 'verificationID').mockReturnValue(of(false));

    component.verificationID(productId);

    expect(productService.verificationID).toHaveBeenCalledWith(productId);
  });
});
