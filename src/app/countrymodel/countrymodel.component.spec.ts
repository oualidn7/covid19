import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrymodelComponent } from './countrymodel.component';

describe('CountrymodelComponent', () => {
  let component: CountrymodelComponent;
  let fixture: ComponentFixture<CountrymodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrymodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrymodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
