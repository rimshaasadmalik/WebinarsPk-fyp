import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewersComponent } from './viewers.component';

describe('ViewersComponent', () => {
  let component: ViewersComponent;
  let fixture: ComponentFixture<ViewersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
