import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  input,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FuelStop } from '../../data/fuel-stops';

Chart.register(...registerables);

@Component({
  selector: 'ft-mpg-chart',
  imports: [],
  templateUrl: './mpg-chart.html',
  styleUrl: './mpg-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MpgChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  readonly stops = input.required<FuelStop[]>();
  readonly averageMpg = input<number>();

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  formatTooltipLabel(value: number | null): string {
    return value !== null ? `${value.toFixed(1)} MPG` : '';
  }

  private createChart(): void {
    const stops = this.stops();
    const stopsWithMpg = stops.filter((s) => s.mpg !== null);

    const labels = stopsWithMpg.map((s) => `${s.location}, ${s.state}`);
    const data = stopsWithMpg.map((s) => s.mpg as number);

    const backgroundColor = 'oklch(0.6 0.2 250 / 80%)';

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'MPG per leg',
            data,
            backgroundColor,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => this.formatTooltipLabel(context.parsed.y),
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: { size: 10 },
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Miles Per Gallon',
            },
          },
        },
      },
    });
  }
}
