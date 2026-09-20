import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TripMap } from '../../components/trip-map/trip-map';
import { StatCard } from '../../components/stat-card/stat-card';
import { MpgChart } from '../../components/mpg-chart/mpg-chart';
import {
  fuelStops,
  tripMetadata,
  calculateTripStats,
  TripStats,
} from '../../data/fuel-stops';

@Component({
  selector: 'ft-dashboard',
  imports: [TripMap, StatCard, MpgChart, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  readonly stops = signal(fuelStops);
  readonly metadata = tripMetadata;
  readonly stats: TripStats = calculateTripStats();

  readonly highlightedStop = signal<number | null>(null);

  readonly formattedTotalMiles = computed(() =>
    this.stats.totalMiles.toLocaleString('en-US', { maximumFractionDigits: 0 })
  );

  readonly formattedTotalCost = computed(() =>
    this.stats.totalCost.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
  );

  readonly formattedActualTrip = computed(() =>
    this.metadata.actualTotalTrip.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })
  );

  readonly formattedAvgMpg = computed(() =>
    this.stats.averageMpg.toFixed(1)
  );

  readonly formattedTotalGallons = computed(() =>
    this.stats.totalGallons.toFixed(1) + ' gal'
  );

  readonly formattedCostPerMile = computed(() =>
    '$' + this.stats.costPerMile.toFixed(2) + '/mile'
  );

  readonly formattedBestMpg = computed(() =>
    this.stats.bestLeg.mpg.toFixed(1) + ' MPG'
  );

  readonly formattedWorstMpg = computed(() =>
    this.stats.worstLeg.mpg.toFixed(1) + ' MPG'
  );

  readonly formattedCheapestPrice = computed(() =>
    '$' + this.stats.cheapestGas.price.toFixed(3)
  );

  readonly formattedMostExpensivePrice = computed(() =>
    '$' + this.stats.mostExpensiveGas.price.toFixed(3)
  );

  readonly bestLegSubtitle = computed(() =>
    this.stats.bestLeg.from + ' → ' + this.stats.bestLeg.to
  );

  readonly worstLegSubtitle = computed(() =>
    this.stats.worstLeg.from + ' → ' + this.stats.worstLeg.to
  );
}
