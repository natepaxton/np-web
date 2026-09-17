import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Panel } from './panel';

@Component({
  imports: [Panel],
  template: `
    <ui-panel [title]="title" [description]="description">
      <p class="body">Body content</p>
      <button panelFooter>Action</button>
    </ui-panel>
  `,
})
class Host {
  title = 'Users';
  description: string | undefined = 'Test the users endpoints';
}

describe('Panel', () => {
  async function render(description?: string) {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.description = description;
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the title and projected content', async () => {
    const el = await render('Test the users endpoints');
    expect(el.querySelector('h2')?.textContent).toBe('Users');
    expect(el.querySelector('[hlmCardContent] .body')?.textContent).toBe('Body content');
    expect(el.querySelector('footer button')?.textContent).toBe('Action');
  });

  it('renders the description when provided', async () => {
    const el = await render('Test the users endpoints');
    expect(el.querySelector('[hlmCardDescription]')?.textContent).toBe('Test the users endpoints');
  });

  it('omits the description when not provided', async () => {
    const el = await render(undefined);
    expect(el.querySelector('[hlmCardDescription]')).toBeNull();
  });
});
