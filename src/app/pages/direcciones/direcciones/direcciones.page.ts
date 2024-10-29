import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule, PopoverController, IonPopover, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkCircle, ellipseOutline, ellipsisVertical }  from 'ionicons/icons';
import { ToastController } from '@ionic/angular/standalone';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { OptionsPopoverComponent } from 'src/app/components/options-popover/options-popover.component';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, IonicModule, HttpClientModule, OptionsPopoverComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DireccionesPage implements OnInit {

  direcciones: any[] = [];
  user: any;
  selectedDireccion: any;
  isLoading: boolean = true;

  @ViewChild('optionsPopover') optionsPopover!: IonPopover;

  constructor(private navCtrl: NavController,
    private http: HttpClient, 
    private sessionService: SessionService,
    private toastController: ToastController,
    private popoverController: PopoverController,
  ) { 
    addIcons({ addOutline, checkmarkCircle, ellipsisVertical, ellipseOutline });
  }

  async ngOnInit() {
    const user = await this.sessionService.get('user');
    if (user) {
      this.user = user;
      this.fetchDirecciones(user.ID_usuario);
    } else {
      this.isLoading = false;
      const toast = await this.toastController.create({
        message: 'Usuario no autenticado. Por favor, inicie sesión para continuar.',
        duration: 3000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
    }
  }

  agregarDireccion() {
    this.navCtrl.navigateForward('/agregardireccion');
  }

  async fetchDirecciones(userId: number) {
    try {
      this.isLoading = true;
      const response = await this.http.get(`${environment.apiUrl}/direccion-envio-user/${userId}`).toPromise();
      if (response) {
        this.direcciones = response as any[];
        // console.log('Direcciones del usuario:', this.direcciones);
      } else {
        console.error('Error al cargar las direcciones guardadas');
      }
    } catch (error) {
      console.error('Error de red al cargar las direcciones:', error);
      const errorToast = await this.toastController.create({
        message: 'Error de red al cargar las direcciones. Por favor, intenta nuevamente.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await errorToast.present();
    }finally {
      this.isLoading = false;
    }
  }

  openOptionsPopover(event: Event, direccion: any) {
    this.selectedDireccion = direccion;
    this.popoverController
      .create({
        component: OptionsPopoverComponent,
        componentProps: { direccion: this.selectedDireccion },
        event: event,
        translucent: true,
      })
      .then((popover) => popover.present());
  }
  
}
