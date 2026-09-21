import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PhotoMapComponent } from './photo-map';
import { Photo } from '../../data/photos';

// Mock Leaflet
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

const mockPhotos: Photo[] = [
  {
    id: 'test-1',
    filename: 'test-photo-1.jpg',
    cameraOwner: 'Nate',
    lat: 44.46,
    lng: -110.83,
    dateTaken: '2026-09-01T10:30:00.000Z',
    dateCategory: 'yellowstone',
    people: ['Nate'],
    geothermals: [],
    wildlife: [],
    vehicles: [],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb1.jpg',
    medium: 'https://example.com/medium1.jpg',
    full: 'https://example.com/full1.jpg',
  },
  {
    id: 'test-2',
    filename: 'test-photo-2.jpg',
    cameraOwner: 'Laura',
    lat: 44.47,
    lng: -110.84,
    dateTaken: '2026-09-01T11:30:00.000Z',
    dateCategory: 'yellowstone',
    people: ['Laura'],
    geothermals: [],
    wildlife: [],
    vehicles: [],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb2.jpg',
    medium: 'https://example.com/medium2.jpg',
    full: 'https://example.com/full2.jpg',
  },
];

@Component({
  imports: [PhotoMapComponent],
  template: `<ys-photo-map [photos]="photos()" (photoSelect)="onPhotoSelect($event)" />`,
})
class TestHost {
  photos = signal<Photo[]>(mockPhotos);
  selectedPhotos: Photo[] = [];
  onPhotoSelect(photos: Photo[]): void {
    this.selectedPhotos = photos;
  }
}

describe('PhotoMapComponent', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const component = fixture.nativeElement.querySelector('ys-photo-map');
    expect(component).toBeTruthy();
  });

  it('should have a map container', () => {
    const mapContainer = fixture.nativeElement.querySelector('.map');
    expect(mapContainer).toBeTruthy();
  });
});
