import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerListingComponent } from './organizer-listing.component';

describe('OrganizerListingComponent', () => {
  let component: OrganizerListingComponent;
  let fixture: ComponentFixture<OrganizerListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizerListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
