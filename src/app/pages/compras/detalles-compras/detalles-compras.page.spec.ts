import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesComprasPage } from './detalles-compras.page';

describe('DetallesComprasPage', () => {
  let component: DetallesComprasPage;
  let fixture: ComponentFixture<DetallesComprasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
