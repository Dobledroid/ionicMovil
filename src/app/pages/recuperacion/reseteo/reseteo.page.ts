import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, NavController, ToastController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-reseteo',
  templateUrl: './reseteo.page.html',
  styleUrls: ['./reseteo.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, IonRouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReseteoPage implements OnInit {
  nuevaContrasenia: string = '';
  confirmarContrasenia: string = '';
  userData: any;
  errores: any = {};

  showNuevaContrasenia: boolean = false;
  showConfirmarContrasenia: boolean = false;

  constructor(private http: HttpClient, private toastController: ToastController, private navCtrl: NavController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    const navigation = history.state;
    if (navigation && navigation.ID_usuario) {
      this.userData = navigation;
    } else {
      console.error('No se encontró el usuario');
      this.mostrarToast('No se encontró la información del usuario.', 'danger');
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'new') {
      this.showNuevaContrasenia = !this.showNuevaContrasenia;
    } else if (field === 'confirm') {
      this.showConfirmarContrasenia = !this.showConfirmarContrasenia;
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
      this.errores.nuevaContrasenia = mensaje.slice(0, -2) + '.'; // Remover la última coma y espacio
    } else {
      this.errores.nuevaContrasenia = null;
    }

    return esValida;
  }

  async actualizarContrasenia() {
    this.errores = {}; // Reiniciar errores
  
    if (this.nuevaContrasenia !== this.confirmarContrasenia) {
      this.errores.confirmarContrasenia = 'Las contraseñas no coinciden.';
      return;
    }
  
    if (!this.validarContrasenia(this.nuevaContrasenia)) {
      return; // No continuar si la validación falla
    }
  
    try {
      const apiUrl = `${environment.apiUrl}/users/update-password/${this.userData.ID_usuario}`;
      const body = {
        contraseña: this.nuevaContrasenia,
      };
  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Fallo al actualizar');
      }
  
      this.mostrarToast('Contraseña actualizada correctamente.', 'success');
      this.navCtrl.navigateForward('/iniciar-sesion');
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      this.mostrarToast('Error al actualizar la contraseña. Inténtalo de nuevo más tarde.', 'danger');
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
}