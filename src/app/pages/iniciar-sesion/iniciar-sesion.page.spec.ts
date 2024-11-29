import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { SessionService } from '../../services/session.service'; // Asegúrate de importar correctamente
import { Storage } from '@ionic/storage-angular'; // Importa el Storage real
import { MockStorage } from './mock-storage'; // El mock que creaste

describe('IniciarSesionPage', () => {
  let component: IniciarSesionPage;
  let fixture: ComponentFixture<IniciarSesionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciarSesionPage],
      providers: [
        { provide: Storage, useClass: MockStorage }, // Reemplazamos el proveedor de Storage con el mock
        SessionService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IniciarSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
