import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertorioFormComponent } from './repertorio-form.component';

describe('RepertorioFormComponent', () => {
  let component: RepertorioFormComponent;
  let fixture: ComponentFixture<RepertorioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepertorioFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepertorioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
