import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, IonRouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecuperacionPage implements OnInit {

  correoElectronico: string = '';
  isEmailValid: boolean = false;

  constructor(private toastController: ToastController, private navCtrl: NavController) {}

  ngOnInit() {}

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailPattern.test(this.correoElectronico);
  }

  async validarCorreo() {
    const apiUrl = `${environment.apiUrl}/users/email/${encodeURIComponent(this.correoElectronico)}`;
    
    try {
      const response = await fetch(apiUrl);
  
      if (response.ok) {
        const userData = await response.json();
  
        // Ahora realiza la segunda solicitud para enviar el correo
        const sendEmailApiUrl = `${environment.apiUrl}/sendMethod`;
        const emailResponse = await fetch(sendEmailApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method: "1",
            email: userData.correoElectronico,
          }),
        });
  
        const emailData = await emailResponse.json();
  
        if (!emailResponse.ok) {
          this.mostrarToast(emailData.msg || 'Error al enviar el código de verificación', 'danger');
          return;
        } else {
          this.mostrarToast('Correo enviado con su código', 'success');
          this.navigateToValidacion(userData);
        }
      } else {
        let errorMessage = '';
  
        switch (response.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta. Por favor proporcione el correo electrónico.';
            break;
          case 401:
            errorMessage = 'Usuario no autorizado. Verifica tus credenciales.';
            break;
          case 404:
            errorMessage = 'Usuario no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Por favor, inténtalo de nuevo más tarde.';
            break;
          default:
            const errorData = await response.json();
            errorMessage = errorData.msg || 'Error desconocido.';
        }
  
        this.mostrarToast(errorMessage, 'danger');
      }
    } catch (error) {
      console.error('Error al validar el correo:', error);
      this.mostrarToast('Error de conexión. Por favor, inténtalo de nuevo más tarde.', 'danger');
    }
  }
  
  
  navigateToValidacion(userData: any) {
    // Assuming you want to navigate to a page named 'validacion' and pass user data
    this.navCtrl.navigateForward('/token', { state: userData });
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
