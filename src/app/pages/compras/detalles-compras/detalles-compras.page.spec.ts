import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesComprasPage } from './detalles-compras.page';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetallesComprasPage', () => {
  let component: DetallesComprasPage;
  let fixture: ComponentFixture<DetallesComprasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Simula el entorno de Ionic
        DetallesComprasPage // Coloca el componente en imports si es standalone
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } } // Mock de ActivatedRoute con parámetro de ejemplo
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
