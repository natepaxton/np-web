import { Component, ChangeDetectionStrategy, input, output, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo, GeothermalType, WildlifeType, VehicleType, NpsSiteType, AttractionType } from '../../data/photos';

@Component({
  selector: 'ys-photo-lightbox',
  imports: [CommonModule],
  templateUrl: './photo-lightbox.html',
  styleUrl: './photo-lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoLightboxComponent {
  photo = input.required<Photo>();
  photos = input.required<Photo[]>();

  closed = output<void>();
  navigate = output<Photo>();

  protected readonly currentIndex = computed(() => {
    return this.photos().findIndex((p) => p.id === this.photo().id);
  });

  protected readonly canGoPrevious = computed(() => {
    return this.currentIndex() > 0;
  });

  protected readonly canGoNext = computed(() => {
    return this.currentIndex() < this.photos().length - 1;
  });

  private readonly geothermalLabels: Record<GeothermalType, string> = {
    geyser: 'Geyser',
    spring: 'Hot Spring',
    'paint-pot': 'Paint Pot',
    mudpot: 'Mudpot',
    fumarole: 'Fumarole',
  };

  private readonly wildlifeLabels: Record<WildlifeType, string> = {
    bison: 'Bison',
    bear: 'Bear',
    moose: 'Moose',
    elk: 'Elk',
    fox: 'Fox',
    wolf: 'Wolf',
    deer: 'Deer',
    pronghorn: 'Pronghorn',
    'prairie-dog': 'Prairie Dog',
    'bighorn-sheep': 'Bighorn Sheep',
    other: 'Other',
  };

  private readonly vehicleLabels: Record<VehicleType, string> = {
    camper: 'Camper',
    subaru: 'Subaru',
  };

  private readonly npsSiteLabels: Record<NpsSiteType, string> = {
    'mammoth-cave': 'Mammoth Cave NP',
    'ste-genevieve': 'Ste. Geneviève NHP',
    'ulysses-grant': 'Ulysses S. Grant NHS',
    'harry-truman': 'Harry S Truman NHS',
    'brown-v-board': 'Brown v. Board NHP',
    homestead: 'Homestead NHP',
    'minuteman-missile': 'Minuteman Missile NHS',
    badlands: 'Badlands NP',
    'wind-cave': 'Wind Cave NP',
    'jewel-cave': 'Jewel Cave NM',
    'mount-rushmore': 'Mount Rushmore NM',
    'devils-tower': 'Devils Tower NM',
    yellowstone: 'Yellowstone NP',
    'grand-teton': 'Grand Teton NP',
    'little-bighorn': 'Little Bighorn NM',
    'theodore-roosevelt': 'Theodore Roosevelt NP',
    'knife-river': 'Knife River NHS',
    'indiana-dunes': 'Indiana Dunes NP',
  };

  private readonly attractionLabels: Record<AttractionType, string> = {
    'wall-drug': 'Wall Drug',
    'needles-highway': 'Needles Highway',
  };

  protected formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  protected formatGeothermal(type: GeothermalType): string {
    return this.geothermalLabels[type];
  }

  protected formatWildlife(type: WildlifeType): string {
    return this.wildlifeLabels[type];
  }

  protected formatVehicle(type: VehicleType): string {
    return this.vehicleLabels[type];
  }

  protected formatNpsSite(type: NpsSiteType): string {
    return this.npsSiteLabels[type];
  }

  protected formatAttraction(type: AttractionType): string {
    return this.attractionLabels[type];
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closed.emit();
        break;
      case 'ArrowLeft':
        this.goPrevious();
        break;
      case 'ArrowRight':
        this.goNext();
        break;
    }
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.closed.emit();
    }
  }

  protected goPrevious(): void {
    if (this.canGoPrevious()) {
      this.navigate.emit(this.photos()[this.currentIndex() - 1]);
    }
  }

  protected goNext(): void {
    if (this.canGoNext()) {
      this.navigate.emit(this.photos()[this.currentIndex() + 1]);
    }
  }

  protected onCloseClick(): void {
    this.closed.emit();
  }
}
