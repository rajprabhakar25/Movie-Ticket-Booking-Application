import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TadminHomeComponent } from './tadmin-home.component';

describe('TadminHomeComponent', () => {
  let component: TadminHomeComponent;
  let fixture: ComponentFixture<TadminHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TadminHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TadminHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
