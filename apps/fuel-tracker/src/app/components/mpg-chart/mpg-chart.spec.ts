import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
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
  chart = viewChild(MpgChart);
}

describe('MpgChart', () => {
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
    const chart = fixture.nativeElement.querySelector('ft-mpg-chart');
    expect(chart).toBeTruthy();
  });

  it('should contain a canvas element', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  describe('formatTooltipLabel', () => {
    it('should format a valid MPG value', () => {
      const chart = host.chart();
      expect(chart?.formatTooltipLabel(12.567)).toBe('12.6 MPG');
    });

    it('should return empty string for null value', () => {
      const chart = host.chart();
      expect(chart?.formatTooltipLabel(null)).toBe('');
    });

    it('should handle zero value', () => {
      const chart = host.chart();
      expect(chart?.formatTooltipLabel(0)).toBe('0.0 MPG');
    });
  });
});
