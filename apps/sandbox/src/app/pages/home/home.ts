import { Component, signal } from '@angular/core';
import { Panel } from '@np-aspire/ui';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-home',
  imports: [Panel, HlmButton, HlmInput],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly name = signal('');
  protected readonly greeting = signal<string | null>(null);

  protected greet(): void {
    const name = this.name().trim();
    this.greeting.set(name ? `Hello, ${name}!` : null);
  }
}
