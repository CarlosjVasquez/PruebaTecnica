import { Component, EventEmitter, Output } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'search',
  standalone: true,
  imports: [InputComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Output() onInputEventemitter: EventEmitter<string> = new EventEmitter();

  onInput(value: string) {
    this.onInputEventemitter.emit(value);
  }
}
