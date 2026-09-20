import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TripMap } from '../../components/trip-map/trip-map';
import { StatCard } from '../../components/stat-card/stat-card';
import { MpgChart } from '../../components/mpg-chart/mpg-chart';
import {
  fuelStops,
  tripMetadata,
  calculateTripStats,
  calculateStateStats,
  elevationData,
  TripStats,
  StateStats,
  ElevationData,
} from '../../data/fuel-stops';

@Component({
  selector: 'ft-dashboard',
  imports: [TripMap, StatCard, MpgChart, CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly stops = signal(fuelStops);
  readonly metadata = tripMetadata;
  readonly stats: TripStats = calculateTripStats();
  readonly stateStats: StateStats[] = calculateStateStats();
  readonly elevation: ElevationData = elevationData;

  readonly highlightedStop = signal<number | null>(null);

  readonly formattedTotalMiles = computed(() =>
    this.stats.totalMiles.toLocaleString('en-US', { maximumFractionDigits: 0 }),
  );

  readonly formattedTotalCost = computed(() =>
    this.stats.totalCost.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
  );

  readonly formattedActualTrip = computed(() =>
    this.metadata.actualTotalTrip.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    }),
  );

  readonly formattedAvgMpg = computed(() => this.stats.averageMpg.toFixed(1));

  readonly formattedTotalGallons = computed(() => this.stats.totalGallons.toFixed(1) + ' gal');

  readonly formattedCostPerMile = computed(() => '$' + this.stats.costPerMile.toFixed(2) + '/mile');

  readonly formattedBestMpg = computed(() => this.stats.bestLeg.mpg.toFixed(1) + ' MPG');

  readonly formattedWorstMpg = computed(() => this.stats.worstLeg.mpg.toFixed(1) + ' MPG');

  readonly formattedCheapestPrice = computed(() => '$' + this.stats.cheapestGas.price.toFixed(3));

  readonly formattedMostExpensivePrice = computed(() => '$' + this.stats.mostExpensiveGas.price.toFixed(3));

  readonly bestLegSubtitle = computed(() => this.stats.bestLeg.from + ' → ' + this.stats.bestLeg.to);

  readonly worstLegSubtitle = computed(() => this.stats.worstLeg.from + ' → ' + this.stats.worstLeg.to);

  readonly formattedAvgDistanceBetweenStops = computed(() =>
    this.stats.averageDistanceBetweenStops.toFixed(0) + ' mi',
  );

  readonly formattedLongestLeg = computed(() => this.stats.longestLeg.miles.toLocaleString('en-US') + ' mi');

  readonly longestLegSubtitle = computed(() => this.stats.longestLeg.from + ' → ' + this.stats.longestLeg.to);

  readonly formattedShortestLeg = computed(() => this.stats.shortestLeg.miles.toLocaleString('en-US') + ' mi');

  readonly shortestLegSubtitle = computed(() => this.stats.shortestLeg.from + ' → ' + this.stats.shortestLeg.to);

  readonly formattedFurthestPoint = computed(() =>
    this.stats.furthestPointFromStart.distanceMiles.toFixed(0) + ' mi',
  );

  readonly formattedHighElevation = computed(() =>
    this.elevation.highPoint.elevation.toLocaleString('en-US') + ' ft',
  );

  readonly formattedLowElevation = computed(() =>
    this.elevation.lowPoint.elevation.toLocaleString('en-US') + ' ft',
  );

  readonly formattedElevationChange = computed(() =>
    (this.elevation.highPoint.elevation - this.elevation.lowPoint.elevation).toLocaleString('en-US') + ' ft',
  );

  readonly stateRoute = computed(() => this.stateStats.map((s) => s.state).join(' → '));
}
