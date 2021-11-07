import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusiconComponent } from './plusicon.component';

describe('PlusiconComponent', () => {
  let component: PlusiconComponent;
  let fixture: ComponentFixture<PlusiconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlusiconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusiconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
