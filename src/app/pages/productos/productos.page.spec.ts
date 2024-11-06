import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Configura el entorno de Ionic
        ProductosPage // Mueve el componente standalone a imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }, // Mock de ActivatedRoute
        { provide: Storage, useValue: {} } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
