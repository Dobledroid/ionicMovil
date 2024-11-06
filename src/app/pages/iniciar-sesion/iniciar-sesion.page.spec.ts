import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from '../../services/session.service';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('IniciarSesionPage', () => {
  let component: IniciarSesionPage;
  let fixture: ComponentFixture<IniciarSesionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        IniciarSesionPage // Coloca el componente standalone en imports
      ],
      providers: [
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['get', 'set']) }, // Mock del SessionService
        { provide: Storage, useValue: jasmine.createSpyObj('Storage', ['get', 'set', 'remove']) }, // Mock de Storage
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: 'sample-id' }) } // Mock de ActivatedRoute, si es necesario
        }
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
