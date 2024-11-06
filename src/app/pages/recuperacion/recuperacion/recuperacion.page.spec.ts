import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperacionPage } from './recuperacion.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

describe('RecuperacionPage', () => {
  let component: RecuperacionPage;
  let fixture: ComponentFixture<RecuperacionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        RecuperacionPage // Coloca el componente en imports si es standalone
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({ token: 'sample-token' }) } }, // Mock de ActivatedRoute con un ejemplo de queryParams
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['get', 'set']) }, // Mock de SessionService
        { provide: Storage, useValue: jasmine.createSpyObj('Storage', ['get', 'set', 'remove']) } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
