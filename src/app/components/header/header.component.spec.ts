import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header.component';
import { SessionService } from '../../services/session.service';
import { Storage } from '@ionic/storage-angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent], // Usa declarations en lugar de imports para el componente
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: SessionService, useValue: {} }, // Mock de SessionService
        { provide: Storage, useValue: {} } // Mock de Storage
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
