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
  attractions: ['wall-drug'],
  thumbnail: 'https://example.com/thumb.jpg',
  medium: 'https://example.com/medium.jpg',
  full: 'https://example.com/full.jpg',
};

const mockPhoto2: Photo = {
  ...mockPhoto,
  id: 'test-2',
  filename: 'test-photo-2.jpg',
  dateTaken: null,
  people: [],
  geothermals: [],
  wildlife: [],
  vehicles: [],
  npsSites: [],
  attractions: [],
};

const mockPhoto3: Photo = {
  ...mockPhoto,
  id: 'test-3',
  filename: 'test-photo-3.jpg',
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
  photos = signal<Photo[]>([mockPhoto, mockPhoto2, mockPhoto3]);
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

  it('should display "Unknown date" when dateTaken is null', () => {
    host.photo.set(mockPhoto2);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Unknown date');
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

  it('should display vehicle tags', () => {
    const vehicleTags = fixture.nativeElement.querySelectorAll('.tag-vehicle');
    expect(vehicleTags.length).toBe(1);
    expect(vehicleTags[0].textContent.trim()).toBe('Camper');
  });

  it('should display NPS site tags', () => {
    const npsTags = fixture.nativeElement.querySelectorAll('.tag-nps');
    expect(npsTags.length).toBe(1);
    expect(npsTags[0].textContent.trim()).toBe('Yellowstone NP');
  });

  it('should display attraction tags', () => {
    const attractionTags = fixture.nativeElement.querySelectorAll('.tag-attraction');
    expect(attractionTags.length).toBe(1);
    expect(attractionTags[0].textContent.trim()).toBe('Wall Drug');
  });

  it('should display photo counter', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1 of 3');
  });

  it('should show next button when not at last photo', () => {
    const nextBtn = fixture.nativeElement.querySelector('.nav-next');
    expect(nextBtn).toBeTruthy();
  });

  it('should not show previous button when at first photo', () => {
    const prevBtn = fixture.nativeElement.querySelector('.nav-prev');
    expect(prevBtn).toBeNull();
  });

  it('should show previous button when not at first photo', () => {
    host.photo.set(mockPhoto2);
    fixture.detectChanges();

    const prevBtn = fixture.nativeElement.querySelector('.nav-prev');
    expect(prevBtn).toBeTruthy();
  });

  it('should not show next button when at last photo', () => {
    host.photo.set(mockPhoto3);
    fixture.detectChanges();

    const nextBtn = fixture.nativeElement.querySelector('.nav-next');
    expect(nextBtn).toBeNull();
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

  it('should emit navigate when previous button is clicked', () => {
    host.photo.set(mockPhoto2);
    fixture.detectChanges();

    const prevBtn = fixture.nativeElement.querySelector('.nav-prev');
    prevBtn.click();
    expect(host.lastNavigatedPhoto).toBe(mockPhoto);
  });

  it('should emit close when backdrop is clicked', () => {
    const backdrop = fixture.nativeElement.querySelector('.lightbox-backdrop');
    backdrop.click();
    expect(host.closeCalled).toBe(true);
  });

  it('should not emit close when clicking inside the content', () => {
    const container = fixture.nativeElement.querySelector('.lightbox-container');
    container.click();
    expect(host.closeCalled).toBe(false);
  });

  describe('keyboard navigation', () => {
    it('should emit close when Escape is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      expect(host.closeCalled).toBe(true);
    });

    it('should navigate to next photo when ArrowRight is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);
      expect(host.lastNavigatedPhoto).toBe(mockPhoto2);
    });

    it('should navigate to previous photo when ArrowLeft is pressed', () => {
      host.photo.set(mockPhoto2);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);
      expect(host.lastNavigatedPhoto).toBe(mockPhoto);
    });

    it('should not navigate when ArrowLeft is pressed at first photo', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      document.dispatchEvent(event);
      expect(host.lastNavigatedPhoto).toBeNull();
    });

    it('should not navigate when ArrowRight is pressed at last photo', () => {
      host.photo.set(mockPhoto3);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(event);
      expect(host.lastNavigatedPhoto).toBeNull();
    });

    it('should ignore other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
      expect(host.closeCalled).toBe(false);
      expect(host.lastNavigatedPhoto).toBeNull();
    });
  });

  describe('photo without tags', () => {
    beforeEach(() => {
      host.photo.set(mockPhoto2);
      fixture.detectChanges();
    });

    it('should not display people tags section when empty', () => {
      const personTags = fixture.nativeElement.querySelectorAll('.tag-person');
      expect(personTags.length).toBe(0);
    });

    it('should not display geothermal tags section when empty', () => {
      const geoTags = fixture.nativeElement.querySelectorAll('.tag-geothermal');
      expect(geoTags.length).toBe(0);
    });

    it('should not display wildlife tags section when empty', () => {
      const wildlifeTags = fixture.nativeElement.querySelectorAll('.tag-wildlife');
      expect(wildlifeTags.length).toBe(0);
    });

    it('should not display vehicle tags section when empty', () => {
      const vehicleTags = fixture.nativeElement.querySelectorAll('.tag-vehicle');
      expect(vehicleTags.length).toBe(0);
    });

    it('should not display NPS site tags section when empty', () => {
      const npsTags = fixture.nativeElement.querySelectorAll('.tag-nps');
      expect(npsTags.length).toBe(0);
    });

    it('should not display attraction tags section when empty', () => {
      const attractionTags = fixture.nativeElement.querySelectorAll('.tag-attraction');
      expect(attractionTags.length).toBe(0);
    });
  });
});
