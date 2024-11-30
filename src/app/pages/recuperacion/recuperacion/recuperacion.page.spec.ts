import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { RecuperacionPage } from './recuperacion.page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';  

describe('RecuperacionPage', () => {
  let component: RecuperacionPage;
  let fixture: ComponentFixture<RecuperacionPage>;
  let toastController: ToastController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ // Asegúrate de importar el componente como un standalone
        IonicModule,
        FormsModule,
        RouterTestingModule,
        RecuperacionPage // Importar directamente el componente standalone
      ],
      providers: [ToastController]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperacionPage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  });

 
  it('should validate email correctly and enable submit button', async () => {
    fixture.detectChanges();
  
    // Obtener el input de correo electrónico directamente del DOM
    const emailInput = fixture.nativeElement.querySelector('ion-input[name="correoElectronico"]');
  
    if (emailInput) {
      // Establecer un valor en el input de correo electrónico
      emailInput.value = 'carlosexequiel360@gmail.com';
      component.correoElectronico = emailInput.value;
      component.validateEmail();

      emailInput.dispatchEvent(new Event('input')); // Disparar el evento de input
      fixture.detectChanges();

      console.log(component.isEmailValid);
      expect(component.isEmailValid).toBeTrue();
  
      await component.validarCorreo();

      // console.log("exists?", component.isEmailExists);
      expect(component.isEmailExists).toBeTrue();
    } else {
      fail('Control de correo electrónico no encontrado');
    }
  });
  

  // it('should show error for invalid email and disable submit button', () => {
  //   component.correoElectronico = 'invalid-email'; // Correo inválido
  //   component.validateEmail();  // Llamamos al método de validación

  //   expect(component.isEmailVaslid).toBeFalse(); // El correo no debe ser válido
  //   const button = fixture.nativeElement.querySelector('ion-button');
  //   expect(button.disabled).toBeTrue(); // El botón de enviar debe estar deshabilitado
  // });
});
