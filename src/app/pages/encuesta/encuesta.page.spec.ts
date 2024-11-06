import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncuestaPage } from './encuesta.page';
import { IonicModule, ModalController } from '@ionic/angular';

describe('EncuestaPage', () => {
  let component: EncuestaPage;
  let fixture: ComponentFixture<EncuestaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Configura el entorno de Ionic
        EncuestaPage // Mueve el componente standalone a imports
      ],
      providers: [
        { provide: ModalController, useValue: {} } // Mock de ModalController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
