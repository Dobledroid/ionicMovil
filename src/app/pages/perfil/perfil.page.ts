import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

import { addIcons } from 'ionicons';
import { cashOutline, logOutOutline, locationOutline }  from 'ionicons/icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonicModule, HttpClientModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PerfilPage implements OnInit {
  nombreUsuario: string | null = null;
  userForm: FormGroup;
  isLoading: boolean = true;
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private sessionService: SessionService,
    private toastController: ToastController,
    private http: HttpClient
  ) {
      this.userForm = this.fb.group({
        nombre: [''],
        primerApellido: [''],
        segundoApellido: [''],
        telefono: [''],
        genero: [null],
      });
      addIcons({cashOutline, logOutOutline, locationOutline});
    }

 async ngOnInit() {
    // Obtener el nombre del usuario desde la sesión
    const userData = await this.sessionService.get('user');
    if (userData && userData.correoElectronico) {
      this.userId = userData.ID_usuario;
      this.fetchUserData(this.userId);
    }
    else {
      this.isLoading = false;
      this.mostrarToast('ID de usuario inválido', 'danger');
    }
  }


  async fetchUserData(userId: number) {
    const apiUrl = `${environment.apiUrl}/users/${userId}`;
    try {
      const response: any = await this.http.get(apiUrl).toPromise();
      if (response) {
        this.userForm.patchValue(response);
        // console.log('Datos del usuario:', response);
      } else {
        console.error('Error al cargar la información del usuario');
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      this.mostrarToast('Error al cargar la información del usuario. Inténtalo de nuevo más tarde.', 'danger');
    } finally {
      this.isLoading = false;
    }
  }


  async guardarInformacion() {
    if (this.userForm.valid) {
      // console.log('Datos del formulario para guardar:', this.userForm.value);

      const apiUrl = `${environment.apiUrl}/users-ionic/${this.userId}`;
      const formData = this.userForm.value;

      try {
        const response = await this.http.put(apiUrl, formData).toPromise();
        // console.log('Respuesta del servidor:', response);
        this.mostrarToast('Información guardada correctamente.', 'success');
      } catch (error) {
        console.error('Error al guardar la información del usuario:', error);
        this.mostrarToast('Error al guardar la información. Inténtalo de nuevo más tarde.', 'danger');
      }
    } else {
      this.mostrarToast('Por favor, llena todos los campos requeridos.', 'warning');
    }
  }

  async mostrarToast(message: string, tipo: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: tipo,
    });
    await toast.present();
  }


}