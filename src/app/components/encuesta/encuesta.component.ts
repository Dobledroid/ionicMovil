import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonButton,
  IonicModule,
  ModalController,
  NavController,
} from '@ionic/angular';
import lottie from 'lottie-web';
import { HeaderComponent } from '../header/header.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EncuestaComponent implements OnInit {
  @Input() ID_pedido!: number;
  @Input() ID_usuario!: number;

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadAnimations();
    }, 200); // Retraso para asegurar que el modal está visible
  }

  loadAnimations() {
    lottie.loadAnimation({
      container: document.getElementById('emoji-triste')!,
      path: 'assets/lottie/sad.json',
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });

    lottie.loadAnimation({
      container: document.getElementById('emoji-neutro')!,
      path: 'assets/lottie/neutral.json',
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });

    lottie.loadAnimation({
      container: document.getElementById('emoji-feliz')!,
      path: 'assets/lottie/happy.json',
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });
  }

  async selectEmoji(selection: string) {
    console.log('Emoji seleccionado:', selection); // Imprimir la selección del emoji
    console.log('ID_usuario:', this.ID_usuario); // Imprimir el ID del usuario
    console.log('ID_pedido:', this.ID_pedido);

    const respuesta = {
      ID_usuario: this.ID_usuario,
      Respuesta: selection,
      FechaRespuesta: new Date().toISOString(), // Mandar la fecha actual
    };

    try {
      // Llamada HTTP POST al backend para guardar la respuesta
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const apiUrl = `${environment.apiUrl}/respuestas`; // Asegúrate de que esta URL es correcta

      await this.http.post(apiUrl, respuesta, { headers }).toPromise();
      console.log('Respuesta guardada correctamente en la base de datos');
    } catch (error) {
      console.error('Error al guardar la respuesta:', error);
    } finally {
      this.cerrarModalYVerDetallePedido();
    }
  }
  async cerrarModalYVerDetallePedido() {
    await this.modalController.dismiss();
    this.navController.navigateForward(`/detalle-compra/${this.ID_pedido}`);
  }
  
  verDetallePedido() {
    this.cerrarModalYVerDetallePedido();
  }
  
}
