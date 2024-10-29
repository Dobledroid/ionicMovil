import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/services/session.service';
import { PopoverController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: true, 
  imports: [HttpClientModule, IonicModule]
})
export class OptionsPopoverComponent {
  @Input() direccion: any;
  @Output() direccionEliminada = new EventEmitter<void>();
  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private popoverController: PopoverController
  ) {}

  async establecerComoPredeterminado() {
    const user = await this.sessionService.get('user');
    if (!user) {
      const errorToast = await this.toastController.create({
        message: 'Usuario no autenticado. Por favor, inicie sesión para continuar.',
        duration: 3000,
        position: 'top',
        color: 'warning'
      });
      await errorToast.present();
      return;
    }
  
    try {
      const response = await fetch(`${environment.apiUrl}/direccion-envio-predeterminada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID_usuario: user.ID_usuario, ID_direccion: this.direccion.ID_direccion })
      });
  
      if (!response.ok) {
        throw new Error('Error al establecer la dirección como predeterminada');
      }
  
      const successToast = await this.toastController.create({
        message: '¡Dirección predeterminada establecida exitosamente!',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      await successToast.present();
      await this.popoverController.dismiss();
      this.direccionEliminada.emit();
    } catch (error) {
      const errorToast = await this.toastController.create({
        message: 'Hubo un problema al establecer la dirección como predeterminada. Por favor, inténtalo de nuevo más tarde.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await errorToast.present();
    }
  }
  

  async eliminarDireccion() {
    try {
      const response = await this.http.delete(`${environment.apiUrl}/direccion-envio/${this.direccion.ID_direccion}`).toPromise();
      if (response) {
        const toast = await this.toastController.create({
          message: 'Dirección eliminada exitosamente.',
          duration: 3000,
          position: 'top',
          color: 'success'
        });
        await toast.present();
        this.direccionEliminada.emit(); 
        await this.popoverController.dismiss();
      }
    } catch (error) {
      const errorToast = await this.toastController.create({
        message: 'Error al eliminar la dirección. Por favor, intenta nuevamente.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await errorToast.present();
    }
  }


}