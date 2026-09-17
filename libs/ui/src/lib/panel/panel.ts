import { Component, input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';

/**
 * A titled card for grouping related content, e.g. one API endpoint's test controls in the sandbox.
 * Projects body content, and optional `[panelFooter]` content into the footer.
 */
@Component({
  selector: 'ui-panel',
  imports: [HlmCardImports],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
