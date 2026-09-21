import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Photo } from '../../data/photos';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ys-photo-map',
  imports: [],
  templateUrl: './photo-map.html',
  styleUrl: './photo-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoMapComponent implements AfterViewInit, OnDestroy {
  photos = input.required<Photo[]>();
  photoSelect = output<Photo[]>();

  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map: L.Map | null = null;
  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private photosByLocation = new Map<string, Photo[]>();

  constructor() {
    // React to photo changes
    effect(() => {
      const photos = this.photos();
      if (this.map) {
        this.updateMarkers(photos);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.updateMarkers(this.photos());
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initializeMap(): void {
    const container = this.mapContainer().nativeElement;

    // Center on Yellowstone area by default
    this.map = L.map(container, {
      center: [44.428, -110.588],
      zoom: 8,
    });

    // Add tile layer (using Stadia Maps dark theme)
    // istanbul ignore next: environment-driven branch, tested via URL construction logic
    const tileUrl = environment.stadiaApiKey
      ? `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${environment.stadiaApiKey}`
      : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
      maxZoom: 20,
    }).addTo(this.map);

    // Initialize marker cluster group
    // leaflet.markercluster augments L at runtime - access via window.L for production builds
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createMarkerClusterGroup = (L as any).markerClusterGroup || (window as any).L?.markerClusterGroup;
    this.markerClusterGroup = createMarkerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count >= 100) {
          size = 'large';
        } else if (count >= 10) {
          size = 'medium';
        }
        return L.divIcon({
          html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
          className: 'photo-cluster',
          iconSize: L.point(40, 40),
        });
      },
    });

    this.map.addLayer(this.markerClusterGroup!);
  }

  private updateMarkers(photos: Photo[]): void {
    if (!this.markerClusterGroup || !this.map) return;

    // Clear existing markers
    this.markerClusterGroup.clearLayers();
    this.photosByLocation.clear();

    // Group photos by location (rounded to ~10m precision to cluster nearby shots)
    photos.forEach((photo) => {
      if (photo.lat !== null && photo.lng !== null) {
        const key = `${photo.lat.toFixed(4)},${photo.lng.toFixed(4)}`;
        if (!this.photosByLocation.has(key)) {
          this.photosByLocation.set(key, []);
        }
        this.photosByLocation.get(key)!.push(photo);
      }
    });

    // Create markers for each location
    const markers: L.Marker[] = [];

    this.photosByLocation.forEach((locationPhotos, key) => {
      const [lat, lng] = key.split(',').map(Number);
      const firstPhoto = locationPhotos[0];

      // Create custom icon with thumbnail
      const icon = L.divIcon({
        html: `
          <div class="photo-marker">
            <img src="${firstPhoto.thumbnail}" alt="" loading="lazy" />
            ${locationPhotos.length > 1 ? `<span class="photo-count">${locationPhotos.length}</span>` : ''}
          </div>
        `,
        className: 'photo-marker-container',
        iconSize: L.point(50, 50),
        iconAnchor: L.point(25, 25),
      });

      const marker = L.marker([lat, lng], { icon });

      marker.on('click', () => {
        this.photoSelect.emit(locationPhotos);
      });

      markers.push(marker);
    });

    this.markerClusterGroup.addLayers(markers);

    // Fit bounds if we have photos
    if (photos.length > 0) {
      const bounds = this.markerClusterGroup.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }
}
