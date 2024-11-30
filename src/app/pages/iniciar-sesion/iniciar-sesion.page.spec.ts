import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { SessionService } from '../../services/session.service';
import { Storage } from '@ionic/storage-angular';
import { MockStorage } from './mock-storage';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, NgForm } from '@angular/forms'; // Asegúrate de importar NgForm
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('IniciarSesionPage', () => {
  let component: IniciarSesionPage;
  let fixture: ComponentFixture<IniciarSesionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IniciarSesionPage,
        RouterTestingModule,
        FormsModule, // Asegúrate de que FormsModule esté importado
      ],
      providers: [
        { provide: Storage, useClass: MockStorage },
        SessionService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map() } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IniciarSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should disable submit button when form is invalid', () => {
    component.email = '';
    component.password = 'password123';
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'ion-button[type="submit"]'
    );
    // console.log('Formulario inválido:', component.email, component.password);
    // console.log('Botón deshabilitado:', submitButton.disabled);
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', async () => {
    const form = fixture.debugElement.query(By.css('#loginForm'));
    const loginForm = form.injector.get(NgForm);
    const emailControl = loginForm.form.get('email');
    const passwordControl = loginForm.form.get('password');
    emailControl?.setValue('carlosexequiel360@gmail.com');
    passwordControl?.setValue('carlosexequiel360@gmail.coM');

    fixture.detectChanges();

    // 5. Imprime los valores actuales de los controles
    // console.log('Formulario completo:', loginForm.form.value);
    // Object.keys(loginForm.form.controls).forEach((controlName) => {
    //   const control = loginForm.form.get(controlName);
    //   console.log(`Control "${controlName}" valor:`, control?.value);
    // });

    // // 6. Verifica si el formulario es válido
    // console.log('Formulario válido:', loginForm.valid);
    // expect(loginForm.valid).toBeTrue();

    // // 7. Verifica el estado del botón
    const submitButton = fixture.nativeElement.querySelector(
      'ion-button[type="submit"]'
    );
  
    // console.log('Botón hasilitado:', !submitButton.disabled);
    expect(submitButton.disabled).toBeFalse();
  });




  it('inicio de sesión', async () => {
    const onSubmitSpy = spyOn(component, 'onSubmit').and.callThrough();
    component.email = 'carlosexequiel360@gmail.com';
    component.password = 'carlosexequiel360@gmail.coM';
    await component.onSubmit(); // Llamar al método

    fixture.detectChanges(); // Detectar cambios en el componente
    // console.log('Estado de isLoggingIn:', component.isLoggingIn);
    expect(component.isLoggingIn).toBeTrue(); // Validar que el valor cambió
  });

});
