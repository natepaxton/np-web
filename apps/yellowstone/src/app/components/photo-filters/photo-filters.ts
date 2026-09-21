import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PhotoFilters,
  formatDateForDisplay,
  GeothermalType,
  WildlifeType,
  VehicleType,
  NpsSiteType,
  AttractionType,
} from '../../data/photos';

@Component({
  selector: 'ys-photo-filters',
  imports: [CommonModule],
  templateUrl: './photo-filters.html',
  styleUrl: './photo-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoFiltersComponent {
  yellowstoneDates = input.required<string[]>();
  people = input.required<string[]>();
  filters = input.required<PhotoFilters>();

  filtersChange = output<PhotoFilters>();

  protected readonly cameraOwners = ['Nate', 'Laura', 'Travis'];
  protected readonly geothermalTypes: { value: GeothermalType; label: string }[] = [
    { value: 'geyser', label: 'Geyser' },
    { value: 'spring', label: 'Hot Spring' },
    { value: 'paint-pot', label: 'Paint Pot' },
    { value: 'mudpot', label: 'Mudpot' },
    { value: 'fumarole', label: 'Fumarole' },
  ];
  protected readonly wildlifeTypes: { value: WildlifeType; label: string }[] = [
    { value: 'bison', label: 'Bison' },
    { value: 'bear', label: 'Bear' },
    { value: 'moose', label: 'Moose' },
    { value: 'elk', label: 'Elk' },
    { value: 'fox', label: 'Fox' },
    { value: 'wolf', label: 'Wolf' },
    { value: 'deer', label: 'Deer' },
    { value: 'pronghorn', label: 'Pronghorn' },
    { value: 'prairie-dog', label: 'Prairie Dog' },
    { value: 'bighorn-sheep', label: 'Bighorn Sheep' },
    { value: 'other', label: 'Other' },
  ];
  protected readonly vehicleTypes: { value: VehicleType; label: string }[] = [
    { value: 'camper', label: 'Camper' },
    { value: 'subaru', label: 'Subaru' },
  ];
  protected readonly npsSiteTypes: { value: NpsSiteType; label: string }[] = [
    { value: 'mammoth-cave', label: 'Mammoth Cave National Park' },
    { value: 'ste-genevieve', label: 'Ste. Geneviève National Historical Park' },
    { value: 'ulysses-grant', label: 'Ulysses S. Grant National Historic Site' },
    { value: 'harry-truman', label: 'Harry S Truman National Historic Site' },
    { value: 'brown-v-board', label: 'Brown v. Board of Education National Historical Park' },
    { value: 'homestead', label: 'Homestead National Historical Park' },
    { value: 'minuteman-missile', label: 'Minuteman Missile National Historic Site' },
    { value: 'badlands', label: 'Badlands National Park' },
    { value: 'wind-cave', label: 'Wind Cave National Park' },
    { value: 'jewel-cave', label: 'Jewel Cave National Monument' },
    { value: 'mount-rushmore', label: 'Mount Rushmore National Memorial' },
    { value: 'devils-tower', label: 'Devils Tower National Monument' },
    { value: 'yellowstone', label: 'Yellowstone National Park' },
    { value: 'grand-teton', label: 'Grand Teton National Park' },
    { value: 'little-bighorn', label: 'Little Bighorn Battlefield National Monument' },
    { value: 'theodore-roosevelt', label: 'Theodore Roosevelt National Park' },
    { value: 'knife-river', label: 'Knife River Indian Villages National Historic Site' },
    { value: 'indiana-dunes', label: 'Indiana Dunes National Park' },
  ];
  protected readonly attractionTypes: { value: AttractionType; label: string }[] = [
    { value: 'wall-drug', label: 'Wall Drug' },
    { value: 'needles-highway', label: 'Needles Highway' },
  ];

  protected formatDate(dateStr: string): string {
    return formatDateForDisplay(dateStr);
  }

  protected isAllDaysSelected(): boolean {
    return this.filters().dates.has('all-days');
  }

  protected isDateSelected(date: string): boolean {
    return this.filters().dates.has(date);
  }

  protected isPersonSelected(person: string): boolean {
    return this.filters().people.has(person);
  }

  protected isCameraOwnerSelected(owner: string): boolean {
    return this.filters().cameraOwners.has(owner);
  }

  protected toggleAllDays(): void {
    const current = this.filters();
    const newDates = new Set<string>();

    if (!current.dates.has('all-days')) {
      // Select all days, clear individual dates
      newDates.add('all-days');
    }
    // If already selected, clicking again clears it (no dates selected)

    this.emitUpdate({
      dates: newDates,
      includeTripOut: newDates.has('all-days') ? current.includeTripOut : false,
      includeTripBack: newDates.has('all-days') ? current.includeTripBack : false,
    });
  }

  protected toggleDate(date: string): void {
    const current = this.filters();
    const newDates = new Set(current.dates);

    // Remove all-days if selecting individual date
    newDates.delete('all-days');

    if (newDates.has(date)) {
      newDates.delete(date);
    } else {
      newDates.add(date);
    }

    this.emitUpdate({
      dates: newDates,
      includeTripOut: false,
      includeTripBack: false,
    });
  }

  protected toggleTripOut(): void {
    const current = this.filters();
    // Only works when all-days is selected
    if (!current.dates.has('all-days')) return;

    this.emitUpdate({
      includeTripOut: !current.includeTripOut,
    });
  }

  protected toggleTripBack(): void {
    const current = this.filters();
    // Only works when all-days is selected
    if (!current.dates.has('all-days')) return;

    this.emitUpdate({
      includeTripBack: !current.includeTripBack,
    });
  }

  protected togglePerson(person: string): void {
    const current = this.filters();
    const newPeople = new Set(current.people);

    if (newPeople.has(person)) {
      newPeople.delete(person);
    } else {
      newPeople.add(person);
    }

    this.emitUpdate({ people: newPeople });
  }

  protected toggleCameraOwner(owner: string): void {
    const current = this.filters();
    const newOwners = new Set(current.cameraOwners);

    if (newOwners.has(owner)) {
      newOwners.delete(owner);
    } else {
      newOwners.add(owner);
    }

    this.emitUpdate({ cameraOwners: newOwners });
  }

  protected clearPeopleFilter(): void {
    this.emitUpdate({ people: new Set() });
  }

  protected clearCameraFilter(): void {
    this.emitUpdate({ cameraOwners: new Set() });
  }

  protected isGeothermalSelected(type: GeothermalType): boolean {
    return this.filters().geothermals.has(type);
  }

  protected isWildlifeSelected(type: WildlifeType): boolean {
    return this.filters().wildlife.has(type);
  }

  protected toggleGeothermal(type: GeothermalType): void {
    const current = this.filters();
    const newGeothermals = new Set(current.geothermals);

    if (newGeothermals.has(type)) {
      newGeothermals.delete(type);
    } else {
      newGeothermals.add(type);
    }

    this.emitUpdate({ geothermals: newGeothermals });
  }

  protected toggleWildlife(type: WildlifeType): void {
    const current = this.filters();
    const newWildlife = new Set(current.wildlife);

    if (newWildlife.has(type)) {
      newWildlife.delete(type);
    } else {
      newWildlife.add(type);
    }

    this.emitUpdate({ wildlife: newWildlife });
  }

  protected clearGeothermalFilter(): void {
    this.emitUpdate({ geothermals: new Set() });
  }

  protected clearWildlifeFilter(): void {
    this.emitUpdate({ wildlife: new Set() });
  }

  protected isVehicleSelected(type: VehicleType): boolean {
    return this.filters().vehicles.has(type);
  }

  protected toggleVehicle(type: VehicleType): void {
    const current = this.filters();
    const newVehicles = new Set(current.vehicles);

    if (newVehicles.has(type)) {
      newVehicles.delete(type);
    } else {
      newVehicles.add(type);
    }

    this.emitUpdate({ vehicles: newVehicles });
  }

  protected clearVehicleFilter(): void {
    this.emitUpdate({ vehicles: new Set() });
  }

  protected isNpsSiteSelected(type: NpsSiteType): boolean {
    return this.filters().npsSites.has(type);
  }

  protected toggleNpsSite(type: NpsSiteType): void {
    const current = this.filters();
    const newNpsSites = new Set(current.npsSites);

    if (newNpsSites.has(type)) {
      newNpsSites.delete(type);
    } else {
      newNpsSites.add(type);
    }

    this.emitUpdate({ npsSites: newNpsSites });
  }

  protected clearNpsSiteFilter(): void {
    this.emitUpdate({ npsSites: new Set() });
  }

  protected isAttractionSelected(type: AttractionType): boolean {
    return this.filters().attractions.has(type);
  }

  protected toggleAttraction(type: AttractionType): void {
    const current = this.filters();
    const newAttractions = new Set(current.attractions);

    if (newAttractions.has(type)) {
      newAttractions.delete(type);
    } else {
      newAttractions.add(type);
    }

    this.emitUpdate({ attractions: newAttractions });
  }

  protected clearAttractionFilter(): void {
    this.emitUpdate({ attractions: new Set() });
  }

  private emitUpdate(partial: Partial<PhotoFilters>): void {
    this.filtersChange.emit({
      ...this.filters(),
      ...partial,
    });
  }
}
