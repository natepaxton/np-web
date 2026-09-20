import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { StatCard } from './stat-card';

@Component({
  imports: [StatCard],
  template: `<ft-stat-card [title]="title" [value]="value" [subtitle]="subtitle" />`,
})
class TestHost {
  title = 'Test Title';
  value = '123';
  subtitle = 'Test Subtitle';
}

describe('StatCard', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should create', () => {
    const statCard = fixture.nativeElement.querySelector('ft-stat-card');
    expect(statCard).toBeTruthy();
  });

  it('should display title and value', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Title');
    expect(compiled.textContent).toContain('123');
  });

  it('should display subtitle when provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Subtitle');
  });
});
