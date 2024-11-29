import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegistroPage implements OnInit {
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  correoElectronico: string = '';
  contrasenia: string = '';
  confirmarContrasenia: string = '';
  aceptaTerminos: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  errores: any = {};

  isSubmitting = false;

  constructor(private http: HttpClient, private toastController: ToastController, private navCtrl: NavController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {}

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  validarFormulario(): boolean {
    this.errores = {};

    // Validar nombre
    if (!this.nombre || this.nombre.length < 3 || !/^[a-zA-Z\s]+$/.test(this.nombre)) {
      this.errores.nombre = 'El nombre debe tener al menos 3 caracteres y solo contener letras.';
    }

    // Validar apellido paterno
    if (!this.apellidoPaterno || this.apellidoPaterno.length < 3 || !/^[a-zA-Z\s]+$/.test(this.apellidoPaterno)) {
      this.errores.apellidoPaterno = 'El apellido paterno debe tener al menos 3 caracteres y solo contener letras.';
    }

    // Validar apellido materno
    if (this.apellidoMaterno && (!/^[a-zA-Z\s]+$/.test(this.apellidoMaterno) || this.apellidoMaterno.length < 3)) {
      this.errores.apellidoMaterno = 'El apellido materno debe tener al menos 3 caracteres y solo contener letras.';
    }

    // Validar correo electrónico
    if (!this.correoElectronico || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.correoElectronico)) {
      this.errores.correoElectronico = 'Ingrese un correo electrónico válido.';
    }

    // Validar contraseña
    if (!this.validarContrasenia(this.contrasenia)) {
      this.errores.contrasenia = 'La contraseña no cumple con los requisitos mínimos.';
    }

    // Validar confirmación de contraseña
    if (this.contrasenia !== this.confirmarContrasenia) {
      this.errores.confirmarContrasenia = 'Las contraseñas no coinciden.';
    }

    // Validar términos y condiciones
    if (!this.aceptaTerminos) {
      this.errores.aceptaTerminos = 'Debe aceptar los términos y condiciones.';
    }

    return Object.keys(this.errores).length === 0;
  }


  async registrarUsuario() {
    if (!this.validarFormulario() || this.isSubmitting) {
      return;
    }
  this.isSubmitting = true;
    const apiUrl = `${environment.apiUrl}/users/`;
    const body = {
      nombre: this.nombre,
      primerApellido: this.apellidoPaterno,
      segundoApellido: this.apellidoMaterno,
      correoElectronico: this.correoElectronico,
      contrasena: this.contrasenia,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        this.mostrarToast('Usuario registrado exitosamente.', 'success');
        this.navigateToLogin();
      } else {
        console.error('Error al registrar el usuario:', response.statusText);
        this.mostrarToast('Error al registrar el usuario. Inténtalo de nuevo más tarde.', 'danger');
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.mostrarToast('Error al registrar el usuario. Inténtalo de nuevo más tarde.', 'danger');
    }
  }

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
  validarContrasenia(password: string): boolean {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    let mensaje = 'La contraseña debe tener: ';
    let esValida = true;

    if (!uppercaseRegex.test(password)) {
      mensaje += 'al menos una letra mayúscula, ';
      esValida = false;
    }

    if (!lowercaseRegex.test(password)) {
      mensaje += 'al menos una letra minúscula, ';
      esValida = false;
    }

    if (!numberRegex.test(password)) {
      mensaje += 'al menos un número, ';
      esValida = false;
    }

    if (!specialCharRegex.test(password)) {
      mensaje += 'al menos un carácter especial, ';
      esValida = false;
    }

    if (!esValida) {
      this.mostrarToast(mensaje.slice(0, -2) + '.', 'warning'); // Remover la última coma y espacio
    }

    return esValida;
  }
  navigateToLogin() {
    this.navCtrl.navigateForward('/iniciar-sesion');
  }
}
