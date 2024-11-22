import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TadminAddMovieFormComponent } from './tadmin-add-movie-form.component';

describe('TadminAddMovieFormComponent', () => {
  let component: TadminAddMovieFormComponent;
  let fixture: ComponentFixture<TadminAddMovieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TadminAddMovieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TadminAddMovieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
