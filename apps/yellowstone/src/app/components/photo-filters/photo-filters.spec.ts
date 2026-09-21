import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
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
  let filtersDebugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    filtersDebugEl = fixture.debugElement.query(By.directive(PhotoFiltersComponent));
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

  it('should display vehicle filter chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Camper');
    expect(compiled.textContent).toContain('Subaru');
  });

  it('should display NPS site filter chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Yellowstone National Park');
    expect(compiled.textContent).toContain('Badlands National Park');
  });

  it('should display attraction filter chips', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Wall Drug');
    expect(compiled.textContent).toContain('Needles Highway');
  });

  it('should emit filtersChange when toggling a person', () => {
    const personChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(2) .filter-chip');
    personChips[0].click();
    fixture.detectChanges();

    expect(host.lastFiltersChange).toBeTruthy();
    expect(host.lastFiltersChange!.people.size).toBe(1);
  });

  it('should toggle person off when clicking again', () => {
    // First set a person as selected
    host.filters.set({
      ...host.filters(),
      people: new Set(['Nate']),
    });
    fixture.detectChanges();

    // Click on Nate to deselect
    const personChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(2) .filter-chip');
    personChips[0].click();
    fixture.detectChanges();

    expect(host.lastFiltersChange!.people.size).toBe(0);
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

  describe('date filtering', () => {
    it('should toggle all-days off when clicking while selected', () => {
      const allDaysBtn = fixture.nativeElement.querySelector('.all-days-btn');
      allDaysBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.dates.size).toBe(0);
    });

    it('should select all-days when clicking while not selected', () => {
      host.filters.set({
        ...host.filters(),
        dates: new Set(),
      });
      fixture.detectChanges();

      const allDaysBtn = fixture.nativeElement.querySelector('.all-days-btn');
      allDaysBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.dates.has('all-days')).toBe(true);
    });

    it('should select individual date and remove all-days', () => {
      const dateBtn = fixture.nativeElement.querySelector('.date-btn');
      dateBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.dates.has('all-days')).toBe(false);
      expect(host.lastFiltersChange!.dates.has('2026-08-30')).toBe(true);
    });

    it('should toggle individual date off when clicking again', () => {
      host.filters.set({
        ...host.filters(),
        dates: new Set(['2026-08-30']),
      });
      fixture.detectChanges();

      const dateBtn = fixture.nativeElement.querySelector('.date-btn');
      dateBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.dates.has('2026-08-30')).toBe(false);
    });

    it('should toggle trip out checkbox', () => {
      const tripOutCheckbox = fixture.nativeElement.querySelector('.trip-toggles input[type="checkbox"]');
      tripOutCheckbox.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.includeTripOut).toBe(true);
    });

    it('should toggle trip back checkbox', () => {
      const checkboxes = fixture.nativeElement.querySelectorAll('.trip-toggles input[type="checkbox"]');
      checkboxes[1].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.includeTripBack).toBe(true);
    });

    it('should not toggle trip out when all-days is not selected', () => {
      host.filters.set({
        ...host.filters(),
        dates: new Set(['2026-08-30']),
      });
      fixture.detectChanges();

      const tripOutCheckbox = fixture.nativeElement.querySelector('.trip-toggles input[type="checkbox"]');
      tripOutCheckbox.click();
      fixture.detectChanges();

      // Should not have emitted a change
      expect(host.lastFiltersChange).toBeNull();
    });

    it('should not toggle trip back when all-days is not selected', () => {
      host.filters.set({
        ...host.filters(),
        dates: new Set(['2026-08-30']),
      });
      fixture.detectChanges();
      host.lastFiltersChange = null;

      const checkboxes = fixture.nativeElement.querySelectorAll('.trip-toggles input[type="checkbox"]');
      checkboxes[1].click();
      fixture.detectChanges();

      // Should not have emitted a change
      expect(host.lastFiltersChange).toBeNull();
    });

    it('should early return from toggleTripOut when all-days is not selected (direct method call)', () => {
      // Set dates to something other than all-days
      host.filters.set({
        ...host.filters(),
        dates: new Set(['2026-08-30']),
      });
      fixture.detectChanges();

      // Get the component instance and call the method directly
      const component = filtersDebugEl.componentInstance as PhotoFiltersComponent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggleTripOut();
      fixture.detectChanges();

      // Should not have emitted a change because of early return
      expect(host.lastFiltersChange).toBeNull();
    });

    it('should early return from toggleTripBack when all-days is not selected (direct method call)', () => {
      // Set dates to something other than all-days
      host.filters.set({
        ...host.filters(),
        dates: new Set(['2026-08-30']),
      });
      fixture.detectChanges();
      host.lastFiltersChange = null;

      // Get the component instance and call the method directly
      const component = filtersDebugEl.componentInstance as PhotoFiltersComponent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (component as any).toggleTripBack();
      fixture.detectChanges();

      // Should not have emitted a change because of early return
      expect(host.lastFiltersChange).toBeNull();
    });
  });

  describe('camera owner filtering', () => {
    it('should toggle camera owner on', () => {
      const cameraChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(3) .filter-chip');
      cameraChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.cameraOwners.has('Nate')).toBe(true);
    });

    it('should toggle camera owner off', () => {
      host.filters.set({
        ...host.filters(),
        cameraOwners: new Set(['Nate']),
      });
      fixture.detectChanges();

      const cameraChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(3) .filter-chip');
      cameraChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.cameraOwners.has('Nate')).toBe(false);
    });

    it('should clear camera filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        cameraOwners: new Set(['Nate']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(3) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.cameraOwners.size).toBe(0);
    });
  });

  describe('geothermal filtering', () => {
    it('should toggle geothermal type on', () => {
      const geoChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(4) .filter-chip');
      geoChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.geothermals.has('geyser')).toBe(true);
    });

    it('should toggle geothermal type off', () => {
      host.filters.set({
        ...host.filters(),
        geothermals: new Set(['geyser']),
      });
      fixture.detectChanges();

      const geoChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(4) .filter-chip');
      geoChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.geothermals.has('geyser')).toBe(false);
    });

    it('should clear geothermal filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        geothermals: new Set(['geyser']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(4) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.geothermals.size).toBe(0);
    });
  });

  describe('wildlife filtering', () => {
    it('should toggle wildlife type on', () => {
      const wildlifeChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(5) .filter-chip');
      wildlifeChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.wildlife.has('bison')).toBe(true);
    });

    it('should toggle wildlife type off', () => {
      host.filters.set({
        ...host.filters(),
        wildlife: new Set(['bison']),
      });
      fixture.detectChanges();

      const wildlifeChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(5) .filter-chip');
      wildlifeChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.wildlife.has('bison')).toBe(false);
    });

    it('should clear wildlife filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        wildlife: new Set(['bison']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(5) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.wildlife.size).toBe(0);
    });
  });

  describe('vehicle filtering', () => {
    it('should toggle vehicle type on', () => {
      const vehicleChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(6) .filter-chip');
      vehicleChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.vehicles.has('camper')).toBe(true);
    });

    it('should toggle vehicle type off', () => {
      host.filters.set({
        ...host.filters(),
        vehicles: new Set(['camper']),
      });
      fixture.detectChanges();

      const vehicleChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(6) .filter-chip');
      vehicleChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.vehicles.has('camper')).toBe(false);
    });

    it('should clear vehicle filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        vehicles: new Set(['camper']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(6) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.vehicles.size).toBe(0);
    });
  });

  describe('NPS site filtering', () => {
    it('should toggle NPS site on', () => {
      const npsChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(7) .filter-chip');
      npsChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.npsSites.has('mammoth-cave')).toBe(true);
    });

    it('should toggle NPS site off', () => {
      host.filters.set({
        ...host.filters(),
        npsSites: new Set(['mammoth-cave']),
      });
      fixture.detectChanges();

      const npsChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(7) .filter-chip');
      npsChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.npsSites.has('mammoth-cave')).toBe(false);
    });

    it('should clear NPS site filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        npsSites: new Set(['mammoth-cave']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(7) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.npsSites.size).toBe(0);
    });
  });

  describe('attraction filtering', () => {
    it('should toggle attraction on', () => {
      const attractionChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(8) .filter-chip');
      attractionChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.attractions.has('wall-drug')).toBe(true);
    });

    it('should toggle attraction off', () => {
      host.filters.set({
        ...host.filters(),
        attractions: new Set(['wall-drug']),
      });
      fixture.detectChanges();

      const attractionChips = fixture.nativeElement.querySelectorAll('.filter-section:nth-child(8) .filter-chip');
      attractionChips[0].click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.attractions.has('wall-drug')).toBe(false);
    });

    it('should clear attraction filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        attractions: new Set(['wall-drug']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(8) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.attractions.size).toBe(0);
    });
  });

  describe('people filtering', () => {
    it('should clear people filter when clear button is clicked', () => {
      host.filters.set({
        ...host.filters(),
        people: new Set(['Nate']),
      });
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.filter-section:nth-child(2) .clear-btn');
      clearBtn.click();
      fixture.detectChanges();

      expect(host.lastFiltersChange!.people.size).toBe(0);
    });
  });
});
