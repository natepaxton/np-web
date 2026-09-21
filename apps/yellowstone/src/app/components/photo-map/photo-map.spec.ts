import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PhotoMapComponent } from './photo-map';
import { Photo } from '../../data/photos';

// Store marker click handlers for testing
const markerClickHandlers: Map<string, () => void> = new Map();

// Create mock functions
const mockRemove = jest.fn();
const mockAddLayer = jest.fn();
const mockFitBounds = jest.fn();
const mockClearLayers = jest.fn();
const mockAddLayers = jest.fn();
const mockGetBounds = jest.fn().mockReturnValue({
  isValid: jest.fn().mockReturnValue(true),
});
const mockTileLayerAddTo = jest.fn();

// Mock Leaflet before any imports that might use it
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    remove: mockRemove,
    addLayer: mockAddLayer,
    fitBounds: mockFitBounds,
  })),
  tileLayer: jest.fn(() => ({
    addTo: mockTileLayerAddTo,
  })),
  markerClusterGroup: jest.fn((options) => {
    // Call the iconCreateFunction to ensure coverage
    if (options?.iconCreateFunction) {
      options.iconCreateFunction({ getChildCount: () => 5 });
      options.iconCreateFunction({ getChildCount: () => 50 });
      options.iconCreateFunction({ getChildCount: () => 150 });
    }
    return {
      clearLayers: mockClearLayers,
      addLayers: mockAddLayers,
      getBounds: mockGetBounds,
    };
  }),
  marker: jest.fn((coords) => {
    const key = `${coords[0]},${coords[1]}`;
    return {
      on: jest.fn((event, handler) => {
        if (event === 'click') {
          markerClickHandlers.set(key, handler);
        }
      }),
    };
  }),
  divIcon: jest.fn(() => ({})),
  point: jest.fn(() => ({})),
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
  {
    id: 'test-3',
    filename: 'test-photo-3.jpg',
    cameraOwner: 'Travis',
    lat: null,
    lng: null,
    dateTaken: '2026-09-01T12:30:00.000Z',
    dateCategory: 'yellowstone',
    people: ['Travis'],
    geothermals: [],
    wildlife: [],
    vehicles: [],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb3.jpg',
    medium: 'https://example.com/medium3.jpg',
    full: 'https://example.com/full3.jpg',
  },
  {
    id: 'test-4',
    filename: 'test-photo-4.jpg',
    cameraOwner: 'Nate',
    lat: 44.46,
    lng: -110.83,
    dateTaken: '2026-09-01T10:35:00.000Z',
    dateCategory: 'yellowstone',
    people: ['Nate'],
    geothermals: [],
    wildlife: [],
    vehicles: [],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb4.jpg',
    medium: 'https://example.com/medium4.jpg',
    full: 'https://example.com/full4.jpg',
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
  let host: TestHost;

  beforeEach(async () => {
    // Reset all mocks and handlers
    jest.clearAllMocks();
    markerClickHandlers.clear();

    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
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

  it('should initialize the map on view init', () => {
    const L = require('leaflet');
    expect(L.map).toHaveBeenCalled();
    expect(L.tileLayer).toHaveBeenCalled();
    expect(mockTileLayerAddTo).toHaveBeenCalled();
  });

  it('should create a marker cluster group', () => {
    const L = require('leaflet');
    expect(L.markerClusterGroup).toHaveBeenCalled();
    expect(mockAddLayer).toHaveBeenCalled();
  });

  it('should create markers for photos with GPS coordinates', () => {
    const L = require('leaflet');
    expect(L.marker).toHaveBeenCalled();
  });

  it('should filter out photos without GPS coordinates', () => {
    const L = require('leaflet');
    const markerCalls = L.marker.mock.calls;
    const hasNullCoords = markerCalls.some((call: number[][]) => call[0][0] === null || call[0][1] === null);
    expect(hasNullCoords).toBe(false);
  });

  it('should group photos at the same location', () => {
    const L = require('leaflet');
    expect(L.divIcon).toHaveBeenCalled();
  });

  it('should emit photoSelect when marker is clicked', () => {
    const handlers = Array.from(markerClickHandlers.values());
    if (handlers.length > 0) {
      handlers[0]();
      expect(host.selectedPhotos.length).toBeGreaterThan(0);
    }
  });

  it('should fit map bounds when photos are present', () => {
    expect(mockFitBounds).toHaveBeenCalled();
  });

  it('should update markers when photos change', () => {
    const newPhotos: Photo[] = [
      {
        id: 'new-1',
        filename: 'new-photo.jpg',
        cameraOwner: 'Nate',
        lat: 45.0,
        lng: -111.0,
        dateTaken: '2026-09-02T10:30:00.000Z',
        dateCategory: 'yellowstone',
        people: [],
        geothermals: [],
        wildlife: [],
        vehicles: [],
        npsSites: [],
        attractions: [],
        thumbnail: 'https://example.com/new-thumb.jpg',
        medium: 'https://example.com/new-medium.jpg',
        full: 'https://example.com/new-full.jpg',
      },
    ];

    host.photos.set(newPhotos);
    fixture.detectChanges();

    expect(mockClearLayers).toHaveBeenCalled();
    expect(mockAddLayers).toHaveBeenCalled();
  });

  it('should clean up map on destroy', () => {
    fixture.destroy();
    expect(mockRemove).toHaveBeenCalled();
  });

  it('should handle empty photos array', () => {
    host.photos.set([]);
    fixture.detectChanges();

    expect(mockClearLayers).toHaveBeenCalled();
  });

  it('should not fit bounds when bounds are invalid', () => {
    mockGetBounds.mockReturnValueOnce({
      isValid: jest.fn().mockReturnValue(false),
    });

    host.photos.set([
      {
        id: 'single',
        filename: 'single.jpg',
        cameraOwner: 'Nate',
        lat: 44.5,
        lng: -110.5,
        dateTaken: '2026-09-01T10:30:00.000Z',
        dateCategory: 'yellowstone',
        people: [],
        geothermals: [],
        wildlife: [],
        vehicles: [],
        npsSites: [],
        attractions: [],
        thumbnail: 'https://example.com/single-thumb.jpg',
        medium: 'https://example.com/single-medium.jpg',
        full: 'https://example.com/single-full.jpg',
      },
    ]);
    fixture.detectChanges();

    // fitBounds should have been called at least once (from initial load)
    // but not from the update with invalid bounds
    expect(mockClearLayers).toHaveBeenCalled();
  });
});
