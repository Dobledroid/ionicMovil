import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenPage } from './token.page';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { Storage } from '@ionic/storage-angular';
import { of } from 'rxjs';

describe('TokenPage', () => {
  let component: TokenPage;
  let fixture: ComponentFixture<TokenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
        TokenPage // Añadir TokenPage en imports
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: of({ token: 'sample-token' }) } }, // Mock de ActivatedRoute con un parámetro de ejemplo
        { provide: SessionService, useValue: jasmine.createSpyObj('SessionService', ['get', 'set']) }, // Mock de SessionService
        { provide: Storage, useValue: jasmine.createSpyObj('Storage', ['get', 'set', 'remove']) } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
