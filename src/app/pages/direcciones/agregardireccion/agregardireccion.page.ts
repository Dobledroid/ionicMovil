import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-agregardireccion',
  templateUrl: './agregardireccion.page.html',
  styleUrls: ['./agregardireccion.page.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonicModule, HttpClientModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AgregardireccionPage implements OnInit {
  nombre: string = '';
  apellidos: string = '';
  pais: string = 'México';
  codigoPostal: string = '43000';
  estado: string = 'Hidalgo';
  ciudad: string = 'Huejutla de Reyes';
  colonia: string = '';
  direccion: string = '';
  telefono: string = '';
  referencias: string = '';
  predeterminado: boolean = true;

  constructor(private toastController: ToastController,
    private navCtrl: NavController,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
  }

  async guardarDireccion() {
    const user = await this.sessionService.get('user');
    if (!user || !user.ID_usuario) {
      const toast = await this.toastController.create({
        message: 'Usuario no autenticado. Por favor, inicie sesión para continuar.',
        duration: 3000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      const response = await fetch(`${environment.apiUrl}/direccion-envio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_usuario: user.ID_usuario,
          nombre: this.nombre,
          apellidos: this.apellidos,
          pais: this.pais,
          direccion: this.direccion,
          ciudad: this.ciudad,
          colonia: this.colonia,
          estado: this.estado,
          codigoPostal: this.codigoPostal,
          telefono: this.telefono,
          referencias: this.referencias,
          predeterminado: this.predeterminado,
        }),
      });

      if (response.ok) {
        const successToast = await this.toastController.create({
          message: 'Dirección de envío guardada exitosamente.',
          duration: 3000,
          position: 'top',
          color: 'success'
        });
        await successToast.present();
        this.handleRegresar();
      } else {
        const errorToast = await this.toastController.create({
          message: 'Error al guardar la dirección de envío.',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        await errorToast.present();
      }
    } catch (error) {
      const networkErrorToast = await this.toastController.create({
        message: 'Error al guardar la dirección de envío. Por favor, intenta nuevamente.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await networkErrorToast.present();
    }
  }

  handleRegresar() {
    this.navCtrl.navigateRoot('/direcciones');
  }

}
