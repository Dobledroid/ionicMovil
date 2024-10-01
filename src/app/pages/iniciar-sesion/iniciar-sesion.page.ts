import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { mail, lockClosed, eye, eyeOff } from 'ionicons/icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Router, RouterModule } from '@angular/router';

import { Storage } from '@ionic/storage-angular';

import { SessionService } from '../../services/session.service';
import { IonRouterLink } from '@ionic/angular/standalone';

import { environment } from '../../../environments/environment';

interface LoginResponse {
  success: boolean;
  nombreUsuario: string;
  token: string;
}

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, IonRouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IniciarSesionPage implements OnInit {
  private apiUrl = environment.apiUrl;

  email: string = '';
  password: string = '';
  passwordType: string = 'password'; // Tipo del input para contraseña
  passwordIcon: string = 'eye'; // Icono inicial para mostrar/ocultar la contraseña
  passwordIconColor: string = 'medium'; // Color inicial del icono

  constructor(private http: HttpClient, private alertController: AlertController, 
    private router: Router,
    private sessionService: SessionService
  ) {
    addIcons({ mail, lockClosed, eye, eyeOff });
  }

  async ngOnInit(
  ) {
  }

  // Método para alternar la visibilidad de la contraseña y cambiar el color del icono
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye' : 'eye-off';
    this.passwordIconColor =
      this.passwordType === 'password' ? 'medium' : 'primary';
  }
  // Método para enviar el formulario
  async onSubmit() {
    if (this.email && this.password) {
      // Definir el cuerpo de la solicitud
      const body = {
        correoElectronico: this.email,
        contraseña: this.password,
      };
  
      try {
        const response = await this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, body).toPromise();
        console.log('Respuesta del servidor:', response);
  
        if (response) {
          // Intentar guardar los datos de sesión
          try {
            await this.sessionService.set('user', response);
            console.log('Datos de sesión guardados correctamente.');
  
            // Redirigir a la vista de inicio
            await this.router.navigate(['/home2']);
          } catch (error) {
            console.error('Error al guardar los datos de sesión:', error);
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Ocurrió un error al guardar los datos de sesión. Por favor, inténtelo de nuevo.',
              buttons: ['OK'],
            });
            await alert.present();
          }
        }
      } catch (err: any) {  // Castear el error a 'any'
        console.error('Error en la solicitud:', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: err.error?.msg || 'Ocurrió un error al iniciar sesión.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
  
  goToRegistro() {
    console.log("VALIDACION");
    this.router.navigate(['/home2']);
  }
}
