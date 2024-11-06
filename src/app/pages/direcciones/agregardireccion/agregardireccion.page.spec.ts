import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregardireccionPage } from './agregardireccion.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

describe('AgregardireccionPage', () => {
  let component: AgregardireccionPage;
  let fixture: ComponentFixture<AgregardireccionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Configura el entorno de Ionic
        AgregardireccionPage // Mueve el componente standalone a imports
      ],
      providers: [
        { provide: Storage, useValue: {} } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregardireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
