import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarcontraseniaPage } from './cambiarcontrasenia.page';

describe('CambiarcontraseniaPage', () => {
  let component: CambiarcontraseniaPage;
  let fixture: ComponentFixture<CambiarcontraseniaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarcontraseniaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
