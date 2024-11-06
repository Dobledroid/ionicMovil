import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerProductoPage } from './ver-producto.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

describe('VerProductoPage', () => {
  let component: VerProductoPage;
  let fixture: ComponentFixture<VerProductoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        VerProductoPage // Asegura que el componente esté en los imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 'sample-product-id' }) } }, // Mock de ActivatedRoute
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['get', 'set']) }, // Mock de SessionService
        { provide: Storage, useValue: jasmine.createSpyObj('Storage', ['get', 'set', 'remove']) } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
