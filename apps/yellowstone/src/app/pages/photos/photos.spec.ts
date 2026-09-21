import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Photos } from './photos';

// Mock Leaflet to prevent errors in tests
jest.mock('leaflet', () => ({
  map: jest.fn().mockReturnValue({
    remove: jest.fn(),
    addLayer: jest.fn(),
    fitBounds: jest.fn(),
  }),
  tileLayer: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
  markerClusterGroup: jest.fn().mockReturnValue({
    clearLayers: jest.fn(),
    addLayers: jest.fn(),
    getBounds: jest.fn().mockReturnValue({
      isValid: jest.fn().mockReturnValue(false),
    }),
  }),
  marker: jest.fn().mockReturnValue({
    on: jest.fn(),
  }),
  divIcon: jest.fn().mockReturnValue({}),
  point: jest.fn().mockReturnValue({}),
}));

jest.mock('leaflet.markercluster', () => ({}));

describe('Photos', () => {
  let fixture: ComponentFixture<Photos>;
  let component: Photos;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photos],
    }).compileComponents();

    fixture = TestBed.createComponent(Photos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the photos page container', () => {
    const container = fixture.nativeElement.querySelector('.photos-page');
    expect(container).toBeTruthy();
  });

  it('should have the photo map component', () => {
    const photoMap = fixture.nativeElement.querySelector('ys-photo-map');
    expect(photoMap).toBeTruthy();
  });

  it('should have the photo filters component', () => {
    const photoFilters = fixture.nativeElement.querySelector('ys-photo-filters');
    expect(photoFilters).toBeTruthy();
  });

  it('should not show lightbox initially', () => {
    const lightbox = fixture.nativeElement.querySelector('ys-photo-lightbox');
    expect(lightbox).toBeNull();
  });
});
