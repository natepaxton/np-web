import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MpgChart } from './mpg-chart';

describe('MpgChart', () => {
  let component: MpgChart;
  let fixture: ComponentFixture<MpgChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpgChart],
    }).compileComponents();

    fixture = TestBed.createComponent(MpgChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
