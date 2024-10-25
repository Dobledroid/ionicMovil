import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
  estado: string = '';
  ciudadSeleccionada: string = ''; // Ciudad seleccionada
  ciudades: string[] = []; // Lista de ciudades obtenidas de la API
  colonia: string = '';
  direccion: string = '';
  telefono: string = '';
  referencias: string = '';
  predeterminado: boolean = true;
  isLoading = false;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.buscarPorCodigoPostal(); // Ejecutar búsqueda automáticamente al cargar la pantalla
  }
  
  buscarPorCodigoPostal() {
    if (this.codigoPostal) {
      this.isLoading = true;
      const url = `https://api.zippopotam.us/MX/${this.codigoPostal}`;

      this.http.get(url).subscribe((data: any) => {
        if (data && data.places && data.places.length > 0) {
          this.isLoading = false;
          this.estado = data.places[0]['state'];
          this.ciudades = data.places.map((place: any) => place['place name']); // Guardamos todas las ciudades
          this.colonia = '';
                } else {
          this.mostrarAlerta('Código Postal no encontrado.');
        }
      }, error => {
        this.isLoading = false;
        console.error('Error al consultar la API', error);
        this.mostrarAlerta('Error al consultar el código postal.');
      });
    }
  }

  // Método para mostrar alertas en caso de errores
  async mostrarAlerta(mensaje: string) {
    const alert = await this.toastController.create({
      header: 'Error',
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'warning'
    });
    await alert.present();
  }

  // Guardar dirección
  async guardarDireccion() {
    this.isLoading = true;
    const user = await this.sessionService.get('user');
    if (!user || !user.ID_usuario) {
      this.isLoading = false;
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
          ciudad: this.ciudadSeleccionada, // Guardar la ciudad seleccionada
          colonia: this.colonia,
          estado: this.estado,
          codigoPostal: this.codigoPostal,
          telefono: this.telefono,
          referencias: this.referencias,
          predeterminado: this.predeterminado,
        }),
      });
      this.isLoading = false;
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
      this.isLoading = false;
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
