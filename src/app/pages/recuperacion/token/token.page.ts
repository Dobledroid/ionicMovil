import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterLink, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-token',
  templateUrl: './token.page.html',
  styleUrls: ['./token.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, IonRouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TokenPage implements OnInit {

  token: string = '';
  userData: any;

  constructor(private navCtrl: NavController, private route: ActivatedRoute,
    private router: Router, private toastController: ToastController
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.userData = navigation.extras.state;
      console.log(this.userData)
    }
  }

   async validarToken(event: Event) {
    event.preventDefault();
    const apiUrl = `${environment.apiUrl}/validateToken`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.userData.ID_usuario,
          token: this.token,
        }),
      });

      const data = await response.json();

      console.log(data)
      if (!response.ok) {
        throw new Error(data.msg);
      }

      // Navegar a la página de restablecimiento de contraseña
      this.navigateToResetPassword();
    } catch (error) {
      const errorMessage = (error as Error).message;
      this.mostrarToast(errorMessage, 'danger');
    }
  }

  
  navigateToResetPassword() {
    this.navCtrl.navigateForward('/reseteo', { state: this.userData });
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
