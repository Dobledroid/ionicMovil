import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

import { addIcons } from 'ionicons';
import { cashOutline, logOutOutline, locationOutline, personOutline, lockClosedOutline, camera }  from 'ionicons/icons';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

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
  ID_usuario: number = 0;
  nombreUsuario: string | null = null;
  imagenUsuario: string | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = true;
  defaultImagen = 'assets/logo.ico';
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private sessionService: SessionService,
    private navCtrl: NavController,
    private http: HttpClient,
    private toastController: ToastController
  ) { 
      addIcons({cashOutline, logOutOutline, locationOutline, personOutline, lockClosedOutline, camera });
    }

 async ngOnInit() {
    // Obtener el nombre del usuario desde la sesión
    const userData = await this.sessionService.get('user');
    console.log(userData)
    if (userData && userData.correoElectronico) {
      this.ID_usuario = userData.ID_usuario;
      this.nombreUsuario = userData.correoElectronico;
      this.obtenerImagenUsuario();
    }
  }

  obtenerImagenUsuario() {
    this.http.get<any>(`${environment.apiUrl}/user-image/${this.ID_usuario}`)
      .subscribe(
        (response) => {
          console.log(response)
          this.imagenUsuario = response.imagenUrl || this.defaultImagen;
          this.isLoading = false; 
        },
        (error) => {
          // Si la respuesta es un 404 (usuario sin imagen), asignamos la imagen por defecto, sin mostrar error
          if (error.status === 404) {
            this.imagenUsuario = this.defaultImagen;
          
          } else {
            // Aquí podrías manejar otros errores, si es necesario
            console.error('Error inesperado al obtener la imagen del usuario:', error);
            this.imagenUsuario = this.defaultImagen;
          }
          this.isLoading = false; 
        }
      );
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click(); // Activa el input de archivo
  }

   onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      // Subir la imagen antes de asignarla a `selectedFile`
      this.subirImagen(file)
        .then((response) => {
          // Si la subida fue exitosa, asigna el archivo y previsualízalo
          this.selectedFile = file;
  
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.imagenUsuario = e.target.result; // Previsualiza la imagen seleccionada
          };
          reader.readAsDataURL(file);
        })
        .catch((error) => {
          // Si hay un error, no hagas nada con el archivo ni lo previsualices
          console.error('Error al subir la imagen:', error);
          alert('Hubo un error al subir la imagen. Inténtalo nuevamente.');
        });
    }
  }


  // Subir la imagen al backend
  subirImagen(file: File): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('ID_usuario', this.ID_usuario.toString()); // Reemplazar con el ID del usuario real
  
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      this.http.post(`${environment.apiUrl}/upload-user-image`, formData)
        .subscribe(
          async (response: any) => {
            console.log('Imagen subida correctamente:', response);
            this.imagenUsuario = response.imagenUrl; // Actualizar la URL de la imagen
  
            const successToast = await this.toastController.create({
              message: 'Imagen subida correctamente.',
              duration: 3000,
              position: 'top',
              color: 'success'
            });
            await successToast.present();
  
            resolve(response); // Resolución exitosa
          },
          async (error) => {
            const errorToast = await this.toastController.create({
              message: 'Error al subir la imagen. Inténtalo de nuevo.',
              duration: 3000,
              position: 'top',
              color: 'danger'
            });
            await errorToast.present();
            console.error('Error al subir la imagen:', error);
  
            reject(error); // Rechazar en caso de error
          }
        );
    });
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
