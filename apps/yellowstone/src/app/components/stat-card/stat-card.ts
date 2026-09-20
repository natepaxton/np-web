import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'ys-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
  readonly variant = input<'default' | 'success' | 'warning' | 'info'>('default');
}
