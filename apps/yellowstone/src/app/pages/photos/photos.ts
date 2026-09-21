import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoMapComponent } from '../../components/photo-map/photo-map';
import { PhotoFiltersComponent } from '../../components/photo-filters/photo-filters';
import { PhotoLightboxComponent } from '../../components/photo-lightbox/photo-lightbox';
import { Photo, PhotoData, PhotoFilters, filterPhotos, getYellowstoneDates } from '../../data/photos';
import photoData from '../../data/photos.json';

@Component({
  selector: 'ys-photos',
  imports: [CommonModule, PhotoMapComponent, PhotoFiltersComponent, PhotoLightboxComponent],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Photos {
  private readonly data = photoData as PhotoData;

  protected readonly allPhotos = this.data.photos;
  protected readonly metadata = this.data.metadata;

  protected readonly yellowstoneDates = getYellowstoneDates(
    this.allPhotos,
    this.metadata.yellowstoneStart,
    this.metadata.yellowstoneEnd,
  );

  protected readonly filters = signal<PhotoFilters>({
    dates: new Set(['all-days']),
    people: new Set(),
    cameraOwners: new Set(),
    geothermals: new Set(),
    wildlife: new Set(),
    vehicles: new Set(),
    npsSites: new Set(),
    attractions: new Set(),
    includeTripOut: false,
    includeTripBack: false,
  });

  protected readonly filteredPhotos = computed(() => {
    return filterPhotos(this.allPhotos, this.filters(), this.metadata.yellowstoneStart, this.metadata.yellowstoneEnd);
  });

  protected readonly photosWithLocation = computed(() => {
    return this.filteredPhotos().filter((p) => p.lat !== null && p.lng !== null);
  });

  protected readonly selectedPhoto = signal<Photo | null>(null);
  protected readonly lightboxPhotos = signal<Photo[]>([]);

  protected onFiltersChange(newFilters: PhotoFilters): void {
    this.filters.set(newFilters);
  }

  protected onPhotoSelect(photos: Photo[]): void {
    if (photos.length > 0) {
      this.lightboxPhotos.set(photos);
      this.selectedPhoto.set(photos[0]);
    }
  }

  protected onLightboxClose(): void {
    this.selectedPhoto.set(null);
    this.lightboxPhotos.set([]);
  }

  protected onLightboxNavigate(photo: Photo): void {
    this.selectedPhoto.set(photo);
  }
}
