import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  input,
  effect,
} from '@angular/core';
import * as L from 'leaflet';
import { FuelStop } from '../../data/fuel-stops';

@Component({
  selector: 'ft-trip-map',
  imports: [],
  templateUrl: './trip-map.html',
  styleUrl: './trip-map.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripMap implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  readonly stops = input.required<FuelStop[]>();
  readonly highlightedStopIndex = input<number | null>(null);

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  constructor() {
    effect(() => {
      const highlighted = this.highlightedStopIndex();
      this.updateHighlight(highlighted);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    const stops = this.stops();
    if (stops.length === 0) return;

    // Center on the middle of the US
    this.map = L.map(this.mapContainer.nativeElement).setView([42, -98], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Fix Leaflet default icon path issue
    const iconDefault = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add markers for each stop
    stops.forEach((stop, index) => {
      const marker = L.marker([stop.lat, stop.lng], { icon: iconDefault }).addTo(this.map as L.Map);

      const mpgText = stop.mpg ? `${stop.mpg.toFixed(1)} MPG` : 'Start';
      const popupContent = `
        <div class="popup-content">
          <strong>${stop.location}, ${stop.state}</strong><br/>
          <span>Stop #${index + 1}</span><br/>
          <span>$${stop.pricePerGallon.toFixed(3)}/gal</span><br/>
          <span>${stop.gallons.toFixed(2)} gallons</span><br/>
          <span>${mpgText}</span>
          ${stop.notes ? `<br/><em>${stop.notes}</em>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent);
      this.markers.push(marker);
    });

    // Fit bounds to show all markers
    const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
    this.map.fitBounds(bounds, { padding: [20, 20] });
  }

  private updateHighlight(index: number | null): void {
    // Could add highlight styling for a specific marker
    if (index !== null && this.markers[index]) {
      this.markers[index].openPopup();
    }
  }
}
