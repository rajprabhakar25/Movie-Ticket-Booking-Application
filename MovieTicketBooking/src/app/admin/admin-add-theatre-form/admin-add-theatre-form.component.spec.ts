import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddTheatreFormComponent } from './admin-add-theatre-form.component';

describe('AdminAddTheatreFormComponent', () => {
  let component: AdminAddTheatreFormComponent;
  let fixture: ComponentFixture<AdminAddTheatreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddTheatreFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddTheatreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
