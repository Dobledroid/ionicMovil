import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

import { addIcons } from 'ionicons';
import { cashOutline, logOutOutline, locationOutline, personOutline, lockClosedOutline }  from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [CommonModule,
    HeaderComponent, FooterComponent, HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CuentaPage implements OnInit {
  nombreUsuario: string | null = null;
  
  constructor(
    private router: Router,
    private alertController: AlertController,
    private sessionService: SessionService,
    private navCtrl: NavController,
  ) { 
      addIcons({cashOutline, logOutOutline, locationOutline, personOutline, lockClosedOutline});
    }

 async ngOnInit() {
    // Obtener el nombre del usuario desde la sesión
    const userData = await this.sessionService.get('user');
    if (userData && userData.correoElectronico) {
      this.nombreUsuario = userData.correoElectronico;
    }
  }

  goToEditarPerfil() {
    this.router.navigate(['/perfil']);
  }

  goToCambiarPass() {
    this.router.navigate(['/cambiarcontrasenia']);
  }

  goToMisCompras() {
    this.router.navigate(['/compras']);
  }

  // Navegar a la página de Mis Direcciones
  goToMisDirecciones() {
    this.router.navigate(['/direcciones']);
  }

  // Cerrar sesión
  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.sessionService.clear(); // Elimina los datos de la sesión
            this.router.navigate(['/iniciar-sesion']); // Redirige al login
          }
        }
      ]
    });
    await alert.present();
  }

  goToIniciarSesion() {
    this.router.navigate(['/iniciar-sesion']);
  }

  goToRegistrarse() {
    this.router.navigate(['/registro']);
  }

}
