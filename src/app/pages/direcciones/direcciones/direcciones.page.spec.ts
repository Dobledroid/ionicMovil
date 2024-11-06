import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DireccionesPage } from './direcciones.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

describe('DireccionesPage', () => {
  let component: DireccionesPage;
  let fixture: ComponentFixture<DireccionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Configura el entorno de Ionic
        DireccionesPage // Mueve el componente standalone a imports
      ],
      providers: [
        { provide: Storage, useValue: {} } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DireccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
