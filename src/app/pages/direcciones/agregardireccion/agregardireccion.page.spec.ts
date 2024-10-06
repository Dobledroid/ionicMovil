import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregardireccionPage } from './agregardireccion.page';

describe('AgregardireccionPage', () => {
  let component: AgregardireccionPage;
  let fixture: ComponentFixture<AgregardireccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregardireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
