import { getUniqueDates, getYellowstoneDates, formatDateForDisplay, filterPhotos, Photo, PhotoFilters } from './photos';

const mockPhotos: Photo[] = [
  {
    id: 'test-1',
    filename: 'test-photo-1.jpg',
    cameraOwner: 'Nate',
    lat: 44.46,
    lng: -110.83,
    dateTaken: '2026-08-29T10:30:00.000Z',
    dateCategory: 'trip-out',
    people: ['Nate', 'Laura'],
    geothermals: [],
    wildlife: [],
    vehicles: ['camper'],
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
    geothermals: ['geyser'],
    wildlife: ['bison'],
    vehicles: [],
    npsSites: ['yellowstone'],
    attractions: [],
    thumbnail: 'https://example.com/thumb2.jpg',
    medium: 'https://example.com/medium2.jpg',
    full: 'https://example.com/full2.jpg',
  },
  {
    id: 'test-3',
    filename: 'test-photo-3.jpg',
    cameraOwner: 'Travis',
    lat: 44.48,
    lng: -110.85,
    dateTaken: '2026-09-06T12:30:00.000Z',
    dateCategory: 'trip-back',
    people: ['Travis'],
    geothermals: [],
    wildlife: ['elk'],
    vehicles: [],
    npsSites: ['badlands'],
    attractions: ['wall-drug'],
    thumbnail: 'https://example.com/thumb3.jpg',
    medium: 'https://example.com/medium3.jpg',
    full: 'https://example.com/full3.jpg',
  },
  {
    id: 'test-4',
    filename: 'test-photo-4.jpg',
    cameraOwner: 'Nate',
    lat: null,
    lng: null,
    dateTaken: '2026-09-02T14:30:00.000Z',
    dateCategory: 'yellowstone',
    people: [],
    geothermals: ['spring'],
    wildlife: [],
    vehicles: ['subaru'],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb4.jpg',
    medium: 'https://example.com/medium4.jpg',
    full: 'https://example.com/full4.jpg',
  },
  {
    id: 'test-5',
    filename: 'test-photo-5.jpg',
    cameraOwner: 'Nate',
    lat: 44.49,
    lng: -110.86,
    dateTaken: null,
    dateCategory: 'unknown',
    people: [],
    geothermals: [],
    wildlife: [],
    vehicles: [],
    npsSites: [],
    attractions: [],
    thumbnail: 'https://example.com/thumb5.jpg',
    medium: 'https://example.com/medium5.jpg',
    full: 'https://example.com/full5.jpg',
  },
];

describe('photos utilities', () => {
  describe('getUniqueDates', () => {
    it('should return unique dates from photos', () => {
      const dates = getUniqueDates(mockPhotos);
      expect(dates).toHaveLength(4);
      expect(dates).toContain('2026-08-29');
      expect(dates).toContain('2026-09-01');
      expect(dates).toContain('2026-09-02');
      expect(dates).toContain('2026-09-06');
    });

    it('should return sorted dates', () => {
      const dates = getUniqueDates(mockPhotos);
      expect(dates[0]).toBe('2026-08-29');
      expect(dates[dates.length - 1]).toBe('2026-09-06');
    });

    it('should skip photos without dateTaken', () => {
      const dates = getUniqueDates(mockPhotos);
      // test-5 has null dateTaken, so we should have 4 dates, not 5
      expect(dates).toHaveLength(4);
    });
  });

  describe('getYellowstoneDates', () => {
    it('should return only dates within Yellowstone range', () => {
      const dates = getYellowstoneDates(mockPhotos, '2026-08-30', '2026-09-05');
      expect(dates).toHaveLength(2);
      expect(dates).toContain('2026-09-01');
      expect(dates).toContain('2026-09-02');
    });

    it('should exclude dates outside Yellowstone range', () => {
      const dates = getYellowstoneDates(mockPhotos, '2026-08-30', '2026-09-05');
      expect(dates).not.toContain('2026-08-29');
      expect(dates).not.toContain('2026-09-06');
    });

    it('should include boundary dates', () => {
      const dates = getYellowstoneDates(mockPhotos, '2026-09-01', '2026-09-02');
      expect(dates).toContain('2026-09-01');
      expect(dates).toContain('2026-09-02');
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format date correctly', () => {
      const formatted = formatDateForDisplay('2026-09-01');
      // The format includes weekday, month, and day
      expect(formatted).toMatch(/\w{3}, \w{3} \d{1,2}/);
    });

    it('should format different dates correctly', () => {
      const formatted = formatDateForDisplay('2026-08-30');
      // Date parsing can differ by timezone, so just check it contains Aug
      expect(formatted).toContain('Aug');
    });
  });

  describe('filterPhotos', () => {
    const defaultFilters: PhotoFilters = {
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
    };

    it('should filter out photos without GPS coordinates', () => {
      const filtered = filterPhotos(mockPhotos, defaultFilters, '2026-08-30', '2026-09-05');
      const hasNoGps = filtered.some((p) => p.lat === null || p.lng === null);
      expect(hasNoGps).toBe(false);
    });

    it('should include only Yellowstone photos when all-days is selected', () => {
      const filtered = filterPhotos(mockPhotos, defaultFilters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.dateCategory === 'yellowstone')).toBe(true);
    });

    it('should include trip-out photos when includeTripOut is true', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        includeTripOut: true,
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.some((p) => p.dateCategory === 'trip-out')).toBe(true);
    });

    it('should include trip-back photos when includeTripBack is true', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        includeTripBack: true,
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.some((p) => p.dateCategory === 'trip-back')).toBe(true);
    });

    it('should filter by people when people filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        people: new Set(['Laura']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.people.includes('Laura'))).toBe(true);
    });

    it('should exclude photos when person filter does not match', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        people: new Set(['NonExistent']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered).toHaveLength(0);
    });

    it('should filter by camera owner when cameraOwners filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        cameraOwners: new Set(['Laura']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.cameraOwner === 'Laura')).toBe(true);
    });

    it('should filter by geothermal type when geothermals filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        geothermals: new Set(['geyser']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.geothermals.includes('geyser'))).toBe(true);
    });

    it('should filter by wildlife type when wildlife filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        includeTripBack: true,
        wildlife: new Set(['elk']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.wildlife.includes('elk'))).toBe(true);
    });

    it('should filter by vehicle type when vehicles filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        includeTripOut: true,
        vehicles: new Set(['camper']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.vehicles.includes('camper'))).toBe(true);
    });

    it('should filter by NPS site when npsSites filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        npsSites: new Set(['yellowstone']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.npsSites.includes('yellowstone'))).toBe(true);
    });

    it('should filter by attraction when attractions filter is set', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        includeTripBack: true,
        attractions: new Set(['wall-drug']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.attractions.includes('wall-drug'))).toBe(true);
    });

    it('should filter by specific date when date is selected', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        dates: new Set(['2026-09-01']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.dateTaken?.startsWith('2026-09-01'))).toBe(true);
    });

    it('should return nothing when no dates are selected', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        dates: new Set(),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered).toHaveLength(0);
    });

    it('should exclude photos with unknown dateCategory when all-days is selected', () => {
      const filtered = filterPhotos(mockPhotos, defaultFilters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.dateCategory !== 'unknown')).toBe(true);
    });

    it('should exclude photos without dateTaken when specific date is selected', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        dates: new Set(['2026-09-01']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      // test-5 has no dateTaken, should be excluded
      expect(filtered.every((p) => p.dateTaken !== null)).toBe(true);
    });

    it('should support multiple date selections', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        dates: new Set(['2026-09-01', '2026-09-02']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every((p) => p.dateTaken?.startsWith('2026-09-01') || p.dateTaken?.startsWith('2026-09-02')),
      ).toBe(true);
    });

    it('should combine multiple filters (AND logic)', () => {
      const filters: PhotoFilters = {
        ...defaultFilters,
        people: new Set(['Laura']),
        geothermals: new Set(['geyser']),
      };
      const filtered = filterPhotos(mockPhotos, filters, '2026-08-30', '2026-09-05');
      expect(filtered.every((p) => p.people.includes('Laura') && p.geothermals.includes('geyser'))).toBe(true);
    });
  });
});
