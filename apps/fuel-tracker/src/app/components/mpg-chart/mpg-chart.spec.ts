import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MpgChart } from './mpg-chart';
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
  imports: [MpgChart],
  template: `<ft-mpg-chart [stops]="stops" [averageMpg]="averageMpg" />`,
})
class TestHost {
  stops = mockStops;
  averageMpg = 12.5;
}

describe('MpgChart', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const chart = fixture.nativeElement.querySelector('ft-mpg-chart');
    expect(chart).toBeTruthy();
  });

  it('should contain a canvas element', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });
});
