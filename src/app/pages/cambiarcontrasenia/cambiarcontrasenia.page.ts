import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-cambiarcontrasenia',
  templateUrl: './cambiarcontrasenia.page.html',
  styleUrls: ['./cambiarcontrasenia.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CambiarcontraseniaPage implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  usuario: any;

  constructor(private http: HttpClient, private toastController: ToastController, private sessionService: SessionService) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  async ngOnInit() {
    this.usuario = await this.sessionService.get('user');
  }

  togglePasswordVisibility(field: string) {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async cambiarContrasenia() {
    if (this.newPassword !== this.confirmPassword) {
      this.mostrarToast('Las contraseñas no coinciden.', 'danger');
      return;
    }

    if (!this.validarContrasenia(this.newPassword)) {
      return;
    }

    // Validar la contraseña actual
    const validatePasswordUrl = `${environment.apiUrl}/users/validate-password-ionic/`;
    try {
      const validateResponse: any = await this.http
        .post(validatePasswordUrl, { correo: this.usuario.correoElectronico, passwordToValidate: this.currentPassword })
        .toPromise();

      console.log("validateResponse ", validateResponse)
      if (!validateResponse) {
        this.mostrarToast('La contraseña actual es incorrecta.', 'danger');
        return;
      }

      // Si la contraseña actual es válida, proceder con el cambio de contraseña
      const updatePasswordUrl = `${environment.apiUrl}/users/update-password/${this.usuario.ID_usuario}`;
      const body = {
        contraseña: this.newPassword
      };

      const response: any = await this.http.put(updatePasswordUrl, body).toPromise();
      console.log("response ", response)
      if (!response.success) {
        this.mostrarToast('Fallo al actualizar.', 'danger');
        return;
      }
      this.mostrarToast('Contraseña cambiada correctamente.', 'success');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      this.mostrarToast('Error al cambiar la contraseña. Inténtalo de nuevo más tarde.', 'danger');
    }
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

  async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
