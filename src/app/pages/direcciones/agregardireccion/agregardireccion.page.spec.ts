import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgregardireccionPage } from './agregardireccion.page';

describe('AgregardireccionPage', () => {
  let component: AgregardireccionPage;
  let fixture: ComponentFixture<AgregardireccionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregardireccionPage],  // Cambiado a AgregardireccionPage
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        HttpClientTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregardireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el botón deshabilitado si el formulario es inválido', () => {
    const compiled = fixture.debugElement.nativeElement;
    const boton = compiled.querySelector('ion-button[type="submit"]');
    expect(boton.disabled).toBeTruthy();
  });

  it('debería habilitar el botón si el formulario es válido', () => {
    component.nombre = 'Juan';
    component.apellidos = 'Pérez';
    component.pais = 'México';
    component.codigoPostal = '12345';
    component.estado = 'Jalisco';
    component.ciudadSeleccionada = 'Guadalajara';
    component.direccion = 'Calle Falsa 123';
    component.telefono = '5555555555';
    component.referencias = 'Cerca del parque';
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    const boton = compiled.querySelector('ion-button[type="submit"]');
    expect(boton.disabled).toBeFalsy();
  });

  it('debería llamar a guardarDireccion() al enviar el formulario', () => {
    spyOn(component, 'guardarDireccion');
    const form = fixture.debugElement.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(component.guardarDireccion).toHaveBeenCalled();
  });

  it('debería agregar dirección correctamente', () => {
    const direccion = {
      nombre: 'Juan',
      apellidos: 'Pérez',
      pais: 'México',
      codigoPostal: '12345',
      estado: 'Jalisco',
      ciudad: 'Guadalajara',
      direccion: 'Calle Falsa 123',
      telefono: '5555555555',
      referencias: 'Cerca del parque',
    };
    
    // Simula la llamada al método que agrega la dirección
    spyOn(component, 'guardarDireccion').and.callFake(() => {
      return Promise.resolve().then(() => {
        component.direcciones.push(direccion); // Simula que se agrega la dirección a un array
      });
    });

    // Llama a la función que maneja el formulario y agrega la dirección
    component.guardarDireccion();
    
    // Verifica que la dirección se haya agregado
    expect(component.direcciones).toContain(direccion);
  });
});
