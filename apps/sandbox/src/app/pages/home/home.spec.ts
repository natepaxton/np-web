import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  async function render() {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    return fixture;
  }

  it('greets the entered name', async () => {
    const fixture = await render();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    (el.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(el.querySelector('[data-testid="greeting"]')?.textContent).toBe('Hello, Ada!');
  });

  it('shows no greeting for a blank name', async () => {
    const fixture = await render();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(el.querySelector('[data-testid="greeting"]')).toBeNull();
  });
});
