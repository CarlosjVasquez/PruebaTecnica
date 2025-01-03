import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input() src: string = '';
  @Input() size: number = 25;
}
