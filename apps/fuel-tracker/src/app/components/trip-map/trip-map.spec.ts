import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TripMap } from './trip-map';
import { FuelStop } from '../../data/fuel-stops';

const mockStops: FuelStop[] = [
  {
    id: 1,
    location: 'Start',
    state: 'WV',
    pricePerGallon: 3.5,
    gallons: 10,
    odometer: 1000,
    distanceFromPrevious: 0,
    mpg: null,
    cost: 35,
    cumulativeDistance: 0,
    cumulativeCost: 35,
    cumulativeGallons: 10,
    lat: 38.0,
    lng: -82.0,
  },
  {
    id: 2,
    location: 'Middle',
    state: 'KY',
    pricePerGallon: 3.6,
    gallons: 12,
    odometer: 1150,
    distanceFromPrevious: 150,
    mpg: 12.5,
    cost: 43.2,
    cumulativeDistance: 150,
    cumulativeCost: 78.2,
    cumulativeGallons: 22,
    lat: 38.2,
    lng: -83.0,
  },
];

@Component({
  imports: [TripMap],
  template: `<ft-trip-map [stops]="stops" />`,
})
class TestHost {
  stops = mockStops;
}

describe('TripMap', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const map = fixture.nativeElement.querySelector('ft-trip-map');
    expect(map).toBeTruthy();
  });

  it('should contain a map container', () => {
    const mapContainer = fixture.nativeElement.querySelector('.map-container');
    expect(mapContainer).toBeTruthy();
  });
});
