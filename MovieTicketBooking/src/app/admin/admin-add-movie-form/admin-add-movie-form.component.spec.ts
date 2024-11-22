import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddMovieFormComponent } from './admin-add-movie-form.component';

describe('AdminAddMovieFormComponent', () => {
  let component: AdminAddMovieFormComponent;
  let fixture: ComponentFixture<AdminAddMovieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddMovieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddMovieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
