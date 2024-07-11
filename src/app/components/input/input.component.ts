import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'custom-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnChanges {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id!: string;
  @Input() name!: string;
  @Input() disabled: boolean = false;
  @Input() errors!: ValidationErrors | null | undefined;
  @Input() required!: boolean;
  @Input() minlength!: number;
  @Input() maxlength!: number;
  @Input() min!: number | string;
  @Input() max!: number;
  @Input() onlyLetters: boolean = false;
  @Output() onChangeEventEmitter: EventEmitter<string> = new EventEmitter();
  @Output() onInputEventEmitter: EventEmitter<string> = new EventEmitter();
  value: any;
  error: string = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errors']?.currentValue) {
      const newErrors = changes['errors'].currentValue;
      if (newErrors['required']) {
        this.error = 'Este campo es requerido';
        return;
      }
      if (newErrors['min']) {
        this.error = `Este campo debe ser mínimo ${newErrors['min']}`;
        return;
      }
      if (newErrors['minlength']) {
        this.error = `Este campo debe tener mínimo ${newErrors['minlength']['requiredLength']} caracteres`;
        return;
      }
      if (newErrors['customError']) {
        this.error = newErrors['customError']['message'];
      }

      return;
    }
    this.error = '';
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouch(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(event: string) {
    this.onChange(event);
    this.onTouch(event);
  }

  onHandleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChangeEventEmitter.emit(target.value);
  }

  onHandleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (this.onlyLetters)
      input.value = input.value.replace(/[^a-zA-Z0-9.\-\sáéíóúÁÉÍÓÚ]/g, '');
    this.onInputEventEmitter.emit(input.value);
  }
}
