import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PhotoLightboxComponent } from './photo-lightbox';
import { Photo } from '../../data/photos';

const mockPhoto: Photo = {
  id: 'test-1',
  filename: 'test-photo.jpg',
  cameraOwner: 'Nate',
  lat: 44.46,
  lng: -110.83,
  dateTaken: '2026-09-01T10:30:00.000Z',
  dateCategory: 'yellowstone',
  people: ['Nate', 'Laura'],
  geothermals: ['geyser'],
  wildlife: ['bison'],
  vehicles: ['camper'],
  npsSites: ['yellowstone'],
  attractions: [],
  thumbnail: 'https://example.com/thumb.jpg',
  medium: 'https://example.com/medium.jpg',
  full: 'https://example.com/full.jpg',
};

const mockPhoto2: Photo = {
  ...mockPhoto,
  id: 'test-2',
  filename: 'test-photo-2.jpg',
  people: [],
  geothermals: [],
  wildlife: [],
  vehicles: [],
  npsSites: [],
  attractions: [],
};

@Component({
  imports: [PhotoLightboxComponent],
  template: `<ys-photo-lightbox
    [photo]="photo()"
    [photos]="photos()"
    (closed)="onClose()"
    (navigate)="onNavigate($event)"
  />`,
})
class TestHost {
  photo = signal<Photo>(mockPhoto);
  photos = signal<Photo[]>([mockPhoto, mockPhoto2]);
  closeCalled = false;
  lastNavigatedPhoto: Photo | null = null;
  onClose(): void {
    this.closeCalled = true;
  }
  onNavigate(photo: Photo): void {
    this.lastNavigatedPhoto = photo;
  }
}

describe('PhotoLightboxComponent', () => {
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
    const component = fixture.nativeElement.querySelector('ys-photo-lightbox');
    expect(component).toBeTruthy();
  });

  it('should display the photo', () => {
    const img = fixture.nativeElement.querySelector('.lightbox-image') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/medium.jpg');
  });

  it('should display the date', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tuesday');
    expect(compiled.textContent).toContain('September 1, 2026');
  });

  it('should display camera owner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain("Nate's camera");
  });

  it('should display people tags', () => {
    const personTags = fixture.nativeElement.querySelectorAll('.tag-person');
    expect(personTags.length).toBe(2);
    expect(personTags[0].textContent.trim()).toBe('Nate');
    expect(personTags[1].textContent.trim()).toBe('Laura');
  });

  it('should display geothermal tags', () => {
    const geoTags = fixture.nativeElement.querySelectorAll('.tag-geothermal');
    expect(geoTags.length).toBe(1);
    expect(geoTags[0].textContent.trim()).toBe('Geyser');
  });

  it('should display wildlife tags', () => {
    const wildlifeTags = fixture.nativeElement.querySelectorAll('.tag-wildlife');
    expect(wildlifeTags.length).toBe(1);
    expect(wildlifeTags[0].textContent.trim()).toBe('Bison');
  });

  it('should display photo counter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1 of 2');
  });

  it('should show navigation buttons when applicable', () => {
    const nextBtn = fixture.nativeElement.querySelector('.nav-next');
    const prevBtn = fixture.nativeElement.querySelector('.nav-prev');
    expect(nextBtn).toBeTruthy();
    expect(prevBtn).toBeNull();
  });

  it('should emit close when close button is clicked', () => {
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    closeBtn.click();
    expect(host.closeCalled).toBe(true);
  });

  it('should emit navigate when next button is clicked', () => {
    const nextBtn = fixture.nativeElement.querySelector('.nav-next');
    nextBtn.click();
    expect(host.lastNavigatedPhoto).toBe(mockPhoto2);
  });

  it('should emit close when backdrop is clicked', () => {
    const backdrop = fixture.nativeElement.querySelector('.lightbox-backdrop');
    backdrop.click();
    expect(host.closeCalled).toBe(true);
  });
});
