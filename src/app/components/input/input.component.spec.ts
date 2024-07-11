import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { SimpleChanges } from '@angular/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let compiled: HTMLElement;

  interface MockFormControls {
    [key: string]: any;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [InputComponent],
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('match to snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });

  test('should render label when provided', () => {
    const label = 'Test Label';
    component.label = label;
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent).toContain(label);
  });

  test('should not display error message when no errors are present', () => {
    component.errors = null;

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeFalsy();
  });

  test('should update error message when errors change', () => {
    const changes = {
      errors: {
        currentValue: {
          minlength: { requiredLength: 5 },
        },
      },
    } as unknown as SimpleChanges & MockFormControls;

    component.ngOnChanges(changes);
    expect(component.error).toBe('Este campo debe tener mínimo 5 caracteres');
  });

  test('should update error message for customError', () => {
    const changes = {
      errors: {
        currentValue: {
          customError: { message: 'Custom error message' },
        },
      },
    } as unknown as SimpleChanges & MockFormControls;

    component.ngOnChanges(changes);
    expect(component.error).toBe('Custom error message');
  });

  test('should clear error message when no errors are present', () => {
    component.error = 'Previous error message';
    const changes = {
      errors: {
        currentValue: null,
      },
    } as unknown as SimpleChanges & MockFormControls;

    component.ngOnChanges(changes);
    expect(component.error).toBe('');
  });

  test('should call onChange and onTouch when updateValue is called', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange');
    const onTouchSpy = jest.spyOn(component, 'onTouch');
    const value = 'New Value';

    component.updateValue(value);
    expect(onChangeSpy).toHaveBeenCalledWith(value);
    expect(onTouchSpy).toHaveBeenCalledWith(value);
  });

  test('should emit onChangeEventEmitter on handle change', () => {
    const value = 'New Value';
    const event = { target: { value } } as unknown as Event & MockFormControls;

    jest.spyOn(component.onChangeEventEmitter, 'emit');
    component.onHandleChange(event);
    expect(component.onChangeEventEmitter.emit).toHaveBeenCalledWith(value);
  });

  test('should emit onInputEventEmitter on handle input', () => {
    const value = 'New Input Value';
    const event = { target: { value } } as unknown as Event & MockFormControls;

    jest.spyOn(component.onInputEventEmitter, 'emit');
    component.onHandleInput(event);
    expect(component.onInputEventEmitter.emit).toHaveBeenCalledWith(value);
  });

  test('should replace non-letter characters if onlyLetters is true', () => {
    const inputValue = 'abc123!@#';
    const cleanedValue = 'abc123';
    const event = { target: { value: inputValue } } as unknown as Event &
      MockFormControls;
    const input = event.target as HTMLInputElement;

    component.onlyLetters = true;
    jest.spyOn(component.onInputEventEmitter, 'emit');
    component.onHandleInput(event);
    expect(input.value).toBe(cleanedValue);
    expect(component.onInputEventEmitter.emit).toHaveBeenCalledWith(
      cleanedValue
    );
  });
});
