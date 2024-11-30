import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonRouterLink, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  isEmailExists: boolean = false;
  constructor(private http: HttpClient, private toastController: ToastController, private navCtrl: NavController) {}

  ngOnInit() {}

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailPattern.test(this.correoElectronico);
  }

  async validarCorreo() {
    const apiUrl = `${environment.apiUrl}/users/email/${encodeURIComponent(this.correoElectronico)}`;
    
    try {
      // Realiza la solicitud para verificar el correo electrónico
      const response = await this.http.get<any>(apiUrl).toPromise();

      if (response) {
        this.isEmailExists = true;
        
        // Realiza la segunda solicitud para enviar el correo
        const sendEmailApiUrl = `${environment.apiUrl}/sendMethod`;
        const emailResponse = await this.http.post<any>(sendEmailApiUrl, {
          method: "1",
          email: response.correoElectronico,
        }).toPromise();

// console.log("emailResponse, ", emailResponse)
        if (!emailResponse) {
          this.mostrarToast(emailResponse.msg || 'Error al enviar el código de verificación', 'danger');
          return;
        } else {
          this.mostrarToast('Correo enviado con su código', 'success');
          this.navigateToValidacion(response);
        }
      } else {
        this.mostrarToast('Usuario no encontrado.', 'danger');
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
