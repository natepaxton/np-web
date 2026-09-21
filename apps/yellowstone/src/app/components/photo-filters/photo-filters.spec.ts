import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PhotoFiltersComponent } from './photo-filters';
import { PhotoFilters } from '../../data/photos';

@Component({
  imports: [PhotoFiltersComponent],
  template: `<ys-photo-filters
    [yellowstoneDates]="yellowstoneDates()"
    [people]="people()"
    [filters]="filters()"
    (filtersChange)="onFiltersChange($event)"
  />`,
})
class TestHost {
  yellowstoneDates = signal(['2026-08-30', '2026-08-31', '2026-09-01']);
  people = signal(['Nate', 'Laura', 'Travis']);
  filters = signal<PhotoFilters>({
    dates: new Set(['all-days']),
    people: new Set<string>(),
    cameraOwners: new Set<string>(),
    geothermals: new Set(),
    wildlife: new Set(),
    vehicles: new Set(),
    npsSites: new Set(),
    attractions: new Set(),
    includeTripOut: false,
    includeTripBack: false,
  });
  lastFiltersChange: PhotoFilters | null = null;
  onFiltersChange(filters: PhotoFilters): void {
    this.lastFiltersChange = filters;
  }
}

describe('PhotoFiltersComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.nativeElement.querySelector('ys-photo-filters');
    expect(component).toBeTruthy();
  });

  it('should display All Yellowstone Days button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('All Yellowstone Days');
  });

  it('should display date buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sun, Aug 30');
    expect(compiled.textContent).toContain('Mon, Aug 31');
  });

  it('should display people chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nate');
    expect(compiled.textContent).toContain('Laura');
    expect(compiled.textContent).toContain('Travis');
  });

  it('should display camera owner chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Nate's camera");
    expect(compiled.textContent).toContain("Laura's camera");
    expect(compiled.textContent).toContain("Travis's camera");
  });

  it('should display geothermal filter chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Geyser');
    expect(compiled.textContent).toContain('Hot Spring');
    expect(compiled.textContent).toContain('Paint Pot');
    expect(compiled.textContent).toContain('Mudpot');
    expect(compiled.textContent).toContain('Fumarole');
  });

  it('should display wildlife filter chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Bison');
    expect(compiled.textContent).toContain('Bear');
    expect(compiled.textContent).toContain('Moose');
    expect(compiled.textContent).toContain('Elk');
  });

  it('should emit filtersChange when toggling a person', () => {
    const personChip = fixture.nativeElement.querySelector('.filter-chips .filter-chip');
    personChip.click();
    fixture.detectChanges();

    expect(host.lastFiltersChange).toBeTruthy();
    expect(host.lastFiltersChange!.people.size).toBe(1);
  });

  it('should show All Yellowstone Days as selected by default', () => {
    const allDaysBtn = fixture.nativeElement.querySelector('.all-days-btn');
    expect(allDaysBtn.classList.contains('selected')).toBe(true);
  });

  it('should display trip out and trip back checkboxes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Include trip out');
    expect(compiled.textContent).toContain('Include trip back');
  });
});
