import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertorioListComponent } from './repertorio-list.component';

describe('RepertorioListComponent', () => {
  let component: RepertorioListComponent;
  let fixture: ComponentFixture<RepertorioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepertorioListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepertorioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
