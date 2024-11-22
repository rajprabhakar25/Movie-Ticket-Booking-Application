import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TadminDashboardComponent } from './tadmin-dashboard.component';

describe('TadminDashboardComponent', () => {
  let component: TadminDashboardComponent;
  let fixture: ComponentFixture<TadminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TadminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TadminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
