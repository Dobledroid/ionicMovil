import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarcontraseniaPage } from './cambiarcontrasenia.page';
import { ToastController } from '@ionic/angular';
import { SessionService } from 'src/app/services/session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CambiarcontraseniaPage', () => {
  let component: CambiarcontraseniaPage;
  let fixture: ComponentFixture<CambiarcontraseniaPage>;
  let mockToastController: jasmine.SpyObj<ToastController>;
  let mockSessionService: jasmine.SpyObj<SessionService>;

  beforeEach(() => {
    // Mock de los servicios
    mockToastController = jasmine.createSpyObj('ToastController', ['create']);
    mockSessionService = jasmine.createSpyObj('SessionService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CambiarcontraseniaPage], // Se importa el componente como módulo
      declarations: [], // No es necesario declarar el componente aquí
      providers: [
        { provide: ToastController, useValue: mockToastController },
        { provide: SessionService, useValue: mockSessionService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar el esquema para evitar advertencias de elementos personalizados
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarcontraseniaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba: Contraseña válida
  it('should return true for valid password', () => {
    const validPassword = 'Valid1Password!';
    const result = component.validarContrasenia(validPassword);
    expect(result).toBeTrue(); // La contraseña debe ser válida
  });

  // Prueba: Contraseña sin mayúsculas
  it('should return false for password without uppercase', async () => {
    const invalidPassword = 'invalid1password!';

    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
    mockToastController.create.and.returnValue(Promise.resolve(toastSpy));

    const result = component.validarContrasenia(invalidPassword);
    expect(result).toBeFalse(); // La contraseña es inválida
    expect(mockToastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'La contraseña debe tener: al menos una letra mayúscula.',
        color: 'warning',
      })
    );
    await toastSpy.present();
    expect(toastSpy.present).toHaveBeenCalled();
  });

  it('should return false for password without lowercase', async () => {
    const invalidPassword = 'INVALID1PASSWORD!'; // Contraseña sin minúsculas
    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
    mockToastController.create.and.returnValue(Promise.resolve(toastSpy));

    const result = component.validarContrasenia(invalidPassword);

    expect(result).toBeFalse(); // La contraseña es inválida
    expect(mockToastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'La contraseña debe tener: al menos una letra minúscula.',
        color: 'warning',
      })
    );

    // Verificar que el toast fue presentado
    await toastSpy.present();
    expect(toastSpy.present).toHaveBeenCalled();
  });

  // Prueba: Contraseña sin números
  it('should return false for password without numbers', async () => {
    const invalidPassword = 'InvalidPassword!';  // Contraseña sin números
    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
    mockToastController.create.and.returnValue(Promise.resolve(toastSpy));
  
    const result = component.validarContrasenia(invalidPassword);
    
    expect(result).toBeFalse();  // La contraseña es inválida
    expect(mockToastController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'La contraseña debe tener: al menos un número.',
      color: 'warning'
    }));
  
    // Verificar que el toast fue presentado
    await toastSpy.present();
    expect(toastSpy.present).toHaveBeenCalled();
  });
  

  // Prueba: Contraseña sin caracteres especiales
  it('should return false for password without special characters', async () => {
    const invalidPassword = 'InvalidPassword1';  // Contraseña sin caracteres especiales
    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
    mockToastController.create.and.returnValue(Promise.resolve(toastSpy));
  
    const result = component.validarContrasenia(invalidPassword);
    
    expect(result).toBeFalse();  // La contraseña es inválida
    expect(mockToastController.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'La contraseña debe tener: al menos un carácter especial.',
      color: 'warning'
    }));
  
    // Verificar que el toast fue presentado
    await toastSpy.present();
    expect(toastSpy.present).toHaveBeenCalled();
  });
  

  // Prueba: Contraseña válida con todos los requisitos
  it('should return true for password with all requirements', () => {
    const validPassword = 'Valid1Password!';  // Contraseña válida con todos los requisitos
    const toastSpy = jasmine.createSpyObj('Toast', ['present']);
    mockToastController.create.and.returnValue(Promise.resolve(toastSpy));
  
    const result = component.validarContrasenia(validPassword);
  
    expect(result).toBeTrue();  // La contraseña debe ser válida
    expect(mockToastController.create).not.toHaveBeenCalled();  // No debe mostrarse el toast si la contraseña es válida
  
    // Verificar que el toast no se haya presentado
    expect(toastSpy.present).not.toHaveBeenCalled();
  });
  
});
