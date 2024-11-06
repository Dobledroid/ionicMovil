import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EncuestaComponent } from './encuesta.component';
import { Storage } from '@ionic/storage-angular';

describe('EncuestaComponent', () => {
  let component: EncuestaComponent;
  let fixture: ComponentFixture<EncuestaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), EncuestaComponent], // Asegura que el componente esté en imports
      providers: [
        { provide: Storage, useValue: {} } // Mock de Storage si el componente lo requiere
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
