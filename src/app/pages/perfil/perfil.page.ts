import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

import { addIcons } from 'ionicons';
import { cashOutline, logOutOutline, locationOutline }  from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonLabel, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PerfilPage implements OnInit {
  nombreUsuario: string | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private sessionService: SessionService) { 
      addIcons({cashOutline, logOutOutline, locationOutline});
    }

 async ngOnInit() {
    // Obtener el nombre del usuario desde la sesión
    const userData = await this.sessionService.get('user');
    if (userData && userData.correoElectronico) {
      this.nombreUsuario = userData.correoElectronico;
    }
  }

  goToMisCompras() {
    this.router.navigate(['/mis-compras']);
  }

  // Navegar a la página de Mis Direcciones
  goToMisDirecciones() {
    this.router.navigate(['/mis-direcciones']);
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

}
